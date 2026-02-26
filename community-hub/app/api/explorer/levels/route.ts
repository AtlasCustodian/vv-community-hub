import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

const VALID_FACTIONS = ["fire", "earth", "water", "wood", "metal"];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const factionIds = searchParams.get("factions")?.split(",") ?? [];

  if (
    factionIds.length === 0 ||
    !factionIds.every((id) => VALID_FACTIONS.includes(id))
  ) {
    return NextResponse.json(
      { error: "Provide valid faction ids as ?factions=fire,earth,water" },
      { status: 400 },
    );
  }

  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      { error: "Database not configured" },
      { status: 500 },
    );
  }

  try {
    const client = await pool.connect();
    try {
      const placeholders = factionIds.map((_, i) => `$${i + 1}`).join(",");
      const res = await client.query(
        `SELECT cel.champion_id, cel.explorer_level, cel.bonus_body,
                cel.bonus_finesse, cel.bonus_spirit, cel.highest_floor, cel.total_runs
         FROM champion_explorer_levels cel
         JOIN champions c ON c.id = cel.champion_id
         WHERE c.faction_id IN (${placeholders})`,
        factionIds,
      );

      const result: Record<
        string,
        {
          explorer_level: number;
          bonus_body: number;
          bonus_finesse: number;
          bonus_spirit: number;
          highest_floor: number;
          total_runs: number;
        }
      > = {};

      for (const row of res.rows) {
        result[row.champion_id] = {
          explorer_level: row.explorer_level,
          bonus_body: row.bonus_body,
          bonus_finesse: row.bonus_finesse,
          bonus_spirit: row.bonus_spirit,
          highest_floor: row.highest_floor,
          total_runs: row.total_runs,
        };
      }

      return NextResponse.json(result);
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("Explorer levels GET error:", err);
    return NextResponse.json(
      { error: "Failed to load explorer levels" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      { error: "Database not configured" },
      { status: 500 },
    );
  }

  try {
    const body = await request.json();
    const {
      championId,
      explorer_level,
      bonus_body,
      bonus_finesse,
      bonus_spirit,
      highest_floor,
      total_runs,
    } = body;

    if (!championId || explorer_level == null) {
      return NextResponse.json(
        { error: "championId and explorer_level are required" },
        { status: 400 },
      );
    }

    const client = await pool.connect();
    try {
      await client.query(
        `INSERT INTO champion_explorer_levels
           (champion_id, explorer_level, bonus_body, bonus_finesse, bonus_spirit, highest_floor, total_runs, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
         ON CONFLICT (champion_id) DO UPDATE SET
           explorer_level = $2,
           bonus_body = $3,
           bonus_finesse = $4,
           bonus_spirit = $5,
           highest_floor = GREATEST(champion_explorer_levels.highest_floor, $6),
           total_runs = $7,
           updated_at = NOW()`,
        [
          championId,
          explorer_level,
          bonus_body ?? 0,
          bonus_finesse ?? 0,
          bonus_spirit ?? 0,
          highest_floor ?? 0,
          total_runs ?? 0,
        ],
      );

      return NextResponse.json({ success: true });
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("Explorer levels POST error:", err);
    return NextResponse.json(
      { error: "Failed to update explorer level" },
      { status: 500 },
    );
  }
}

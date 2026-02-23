import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

const VALID_FACTIONS = ["fire", "earth", "water", "wood", "metal"];

interface DbRow {
  [key: string]: unknown;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const factionIds = searchParams.get("factions")?.split(",") ?? [];

  if (
    factionIds.length === 0 ||
    !factionIds.every((id) => VALID_FACTIONS.includes(id))
  ) {
    return NextResponse.json(
      { error: "Provide valid faction ids as ?factions=fire,earth,water" },
      { status: 400 }
    );
  }

  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      { error: "Database not configured" },
      { status: 500 }
    );
  }

  try {
    const client = await pool.connect();
    try {
      const result: Record<string, { id: string; name: string; returnRate: number; stabilityScore: number }[]> = {};

      for (const factionId of factionIds) {
        const res = await client.query(
          `SELECT id, name, balance, standing
           FROM champions
           WHERE faction_id = $1
           ORDER BY (balance - 15000) DESC, standing DESC
           LIMIT 12`,
          [factionId]
        );

        result[factionId] = res.rows.map((row: DbRow) => ({
          id: row.id as string,
          name: row.name as string,
          returnRate: ((row.balance as number) - 15000) / 1000000,
          stabilityScore: row.standing as number,
        }));
      }

      return NextResponse.json(result);
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("Champions API error:", err);
    return NextResponse.json(
      { error: "Failed to load champions" },
      { status: 500 }
    );
  }
}

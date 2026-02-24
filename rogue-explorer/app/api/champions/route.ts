import { NextResponse } from "next/server";
import STATIC_CHAMPIONS from "@/data/championData";

const VALID_FACTIONS = ["fire", "earth", "water", "wood", "metal"];

interface DbRow {
  [key: string]: unknown;
}

export async function GET() {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json(STATIC_CHAMPIONS);
  }

  try {
    const pool = (await import("@/lib/db")).default;
    const client = await pool.connect();
    try {
      const result: Record<
        string,
        { id: string; name: string; returnRate: number; stabilityScore: number }[]
      > = {};

      for (const factionId of VALID_FACTIONS) {
        const res = await client.query(
          `SELECT id, name, balance, standing, faction_id
           FROM champions
           WHERE faction_id = $1
           ORDER BY (balance - 15000) DESC, standing DESC
           LIMIT 12`,
          [factionId],
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
    return NextResponse.json(STATIC_CHAMPIONS);
  }
}

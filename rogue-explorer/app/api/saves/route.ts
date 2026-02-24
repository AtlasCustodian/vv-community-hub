import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

const ENSURE_TABLE = `
  CREATE TABLE IF NOT EXISTS explorer_saves (
    id TEXT PRIMARY KEY,
    champion_id TEXT NOT NULL,
    champion_data JSONB NOT NULL,
    tower_data JSONB,
    status TEXT DEFAULT 'preparing',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  );
`;

let tableEnsured = false;

async function ensureTable() {
  if (tableEnsured) return;
  const client = await pool.connect();
  try {
    await client.query(ENSURE_TABLE);
    tableEnsured = true;
  } finally {
    client.release();
  }
}

export async function GET(request: NextRequest) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      { error: "Database not configured" },
      { status: 500 },
    );
  }

  try {
    await ensureTable();
    const { searchParams } = new URL(request.url);
    const championId = searchParams.get("championId");

    const client = await pool.connect();
    try {
      let res;
      if (championId) {
        res = await client.query(
          `SELECT id, champion_id, champion_data, tower_data, status, created_at, updated_at
           FROM explorer_saves
           WHERE champion_id = $1
           ORDER BY updated_at DESC`,
          [championId],
        );
      } else {
        res = await client.query(
          `SELECT id, champion_id, champion_data, tower_data, status, created_at, updated_at
           FROM explorer_saves
           ORDER BY updated_at DESC
           LIMIT 20`,
        );
      }

      const saves = res.rows.map((row) => ({
        id: row.id,
        champion: row.champion_data,
        tower: row.tower_data,
        status: row.status,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }));

      return NextResponse.json(saves);
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("Saves GET error:", err);
    return NextResponse.json(
      { error: "Failed to load saves" },
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
    await ensureTable();
    const body = await request.json();
    const { id, champion, tower, status } = body;

    if (!id || !champion) {
      return NextResponse.json(
        { error: "id and champion are required" },
        { status: 400 },
      );
    }

    const client = await pool.connect();
    try {
      await client.query(
        `INSERT INTO explorer_saves (id, champion_id, champion_data, tower_data, status, updated_at)
         VALUES ($1, $2, $3, $4, $5, NOW())
         ON CONFLICT (id) DO UPDATE SET
           champion_data = $3,
           tower_data = $4,
           status = $5,
           updated_at = NOW()`,
        [
          id,
          champion.championId,
          JSON.stringify(champion),
          tower ? JSON.stringify(tower) : null,
          status || "preparing",
        ],
      );

      return NextResponse.json({ success: true, id });
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("Saves POST error:", err);
    return NextResponse.json(
      { error: "Failed to save" },
      { status: 500 },
    );
  }
}

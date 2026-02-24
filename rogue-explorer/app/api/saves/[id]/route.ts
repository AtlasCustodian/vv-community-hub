import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      { error: "Database not configured" },
      { status: 500 },
    );
  }

  const { id } = await params;

  try {
    const client = await pool.connect();
    try {
      const res = await client.query(
        `SELECT id, champion_id, champion_data, tower_data, status, created_at, updated_at
         FROM explorer_saves
         WHERE id = $1`,
        [id],
      );

      if (res.rows.length === 0) {
        return NextResponse.json(
          { error: "Save not found" },
          { status: 404 },
        );
      }

      const row = res.rows[0];
      return NextResponse.json({
        id: row.id,
        champion: row.champion_data,
        tower: row.tower_data,
        status: row.status,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      });
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("Save GET error:", err);
    return NextResponse.json(
      { error: "Failed to load save" },
      { status: 500 },
    );
  }
}

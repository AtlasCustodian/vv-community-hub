import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const client = await pool.connect();
    try {
      const res = await client.query(
        "SELECT id, title, subtitle, author, created_at FROM chronicle_posts ORDER BY created_at ASC"
      );
      return NextResponse.json(res.rows);
    } finally {
      client.release();
    }
  } catch (error: unknown) {
    const isTableMissing =
      error instanceof Error &&
      "code" in error &&
      (error as { code: string }).code === "42P01";

    if (isTableMissing) {
      return NextResponse.json([]);
    }

    console.error("Chronicles query error:", error);
    return NextResponse.json([], { status: 500 });
  }
}

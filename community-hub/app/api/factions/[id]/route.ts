import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

const VALID_FACTIONS = ["fire", "earth", "water", "wood", "metal"];

interface DbRow {
  [key: string]: unknown;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: factionId } = await params;

  if (!VALID_FACTIONS.includes(factionId)) {
    return NextResponse.json({ error: "Invalid faction id" }, { status: 400 });
  }

  try {
    const client = await pool.connect();

    try {
      // 1. Faction standing
      const factionRes = await client.query(
        "SELECT standing FROM factions WHERE id = $1",
        [factionId]
      );
      const standing = (factionRes.rows[0] as DbRow | undefined)?.standing ?? null;

      // 2. Main user (first non-champion user for this faction)
      const mainUserRes = await client.query(
        "SELECT id, name, faction_id, balance, starting_balance, standing FROM users WHERE faction_id = $1 AND (is_champion = false OR is_champion IS NULL) ORDER BY id ASC LIMIT 1",
        [factionId]
      );
      const mainUser = (mainUserRes.rows[0] as DbRow | undefined) ?? null;

      // 3. Champions
      const championsRes = await client.query(
        "SELECT id, name, balance, starting_balance, standing FROM users WHERE faction_id = $1 AND is_champion = true ORDER BY id ASC",
        [factionId]
      );
      const champions = championsRes.rows.map((row: DbRow) => ({
        id: row.id as string,
        name: row.name as string,
        returnRate: ((row.balance as number) - 15000) / 1000000,
        stabilityScore: row.standing as number,
      }));

      // 4. All users (non-champion, for chat etc.)
      const usersRes = await client.query(
        "SELECT id, name, balance, starting_balance, standing FROM users WHERE faction_id = $1 AND (is_champion = false OR is_champion IS NULL) ORDER BY id ASC",
        [factionId]
      );
      const users = usersRes.rows.map((row: DbRow) => ({
        id: row.id as string,
        name: row.name as string,
        balance: row.balance as number,
        startingBalance: row.starting_balance as number,
        standing: row.standing as number,
      }));

      // 5. Infrastructure - facility sections
      const facilitySectionsRes = await client.query(
        "SELECT id, name, capacity, details FROM infrastructure WHERE faction_id = $1 AND details->>'type' = 'facility_section' ORDER BY id ASC",
        [factionId]
      );
      const facilitySections = facilitySectionsRes.rows.map((row: DbRow) => {
        const details = row.details as Record<string, unknown> | null;
        return {
          id: row.id as string,
          name: row.name as string,
          health: row.capacity as number,
          description: (details?.description as string) ?? "",
          stats: (details?.stats as Record<string, string>) ?? {},
        };
      });

      // 6. Infrastructure - grid nodes (various types)
      const gridNodeTypes = [
        "generator",
        "trade_node",
        "guard_tower",
        "breaker_station",
        "command_center",
        "supply_node",
        "relay_node",
      ];
      const gridNodesRes = await client.query(
        "SELECT id, name, capacity, details FROM infrastructure WHERE faction_id = $1 AND details->>'type' = ANY($2) ORDER BY id ASC",
        [factionId, gridNodeTypes]
      );
      const gridNodes = gridNodesRes.rows.map((row: DbRow) => {
        const details = row.details as Record<string, unknown> | null;
        return {
          id: row.id as string,
          name: row.name as string,
          health: row.capacity as number,
          x: (details?.x as number) ?? 0,
          y: (details?.y as number) ?? 0,
          assignedUsers: (details?.assigned_users as number) ?? 0,
        };
      });

      // 7. Infrastructure - network connections (edges)
      const networkRes = await client.query(
        "SELECT details FROM infrastructure WHERE id = $1",
        [`${factionId}_network`]
      );
      const networkDetails = (networkRes.rows[0] as DbRow | undefined)?.details as Record<string, unknown> | null;
      const rawEdges = (networkDetails?.edges ?? []) as Array<{ from: string; to: string; health: number }>;
      const gridEdges = rawEdges.map((edge) => ({
        from: edge.from,
        to: edge.to,
        health: edge.health,
      }));

      // 8. Feed entries
      const feedRes = await client.query(
        "SELECT tick, faction_id, feed_type, content, narrator_type, timestamp FROM feed_entries WHERE faction_id = $1 OR faction_id IS NULL ORDER BY timestamp ASC",
        [factionId]
      );
      const feedEntries = feedRes.rows;

      // 9. Events
      const eventsRes = await client.query(
        "SELECT tick, source, event_type, raw_input, magnitude, direction, scope, target_faction_id, narrative_data, faction_impacts, timestamp FROM events WHERE target_faction_id = $1 OR target_faction_id IS NULL ORDER BY timestamp ASC",
        [factionId]
      );
      const events = eventsRes.rows;

      // 10. Zone conditions
      const zoneRes = await client.query("SELECT id, condition FROM zones");
      const zones = Object.fromEntries(
        zoneRes.rows.map((row: DbRow) => [row.id as string, row.condition as number])
      );

      return NextResponse.json({
        factionId,
        standing,
        mainUser,
        champions,
        users,
        facilitySections,
        gridNodes,
        gridEdges,
        feedEntries,
        events,
        zones,
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Database query error:", error);
    return NextResponse.json(
      { error: "Failed to fetch faction data" },
      { status: 500 }
    );
  }
}

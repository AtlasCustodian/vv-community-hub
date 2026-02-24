const { Client } = require("pg");

const DATABASE_URL =
  process.env.DATABASE_URL ||
  "postgresql://postgres:nxrXDTmRxroFJdlUSlkDOHbxNJIJjoec@nozomi.proxy.rlwy.net:15035/railway";

const client = new Client({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function migrate() {
  await client.connect();
  console.log("Connected to Railway PostgreSQL");

  try {
    await client.query("BEGIN");

    await client.query(`
      CREATE TABLE IF NOT EXISTS arena_players (
        id TEXT PRIMARY KEY,
        display_name TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
    console.log("  + arena_players");

    await client.query(`
      CREATE TABLE IF NOT EXISTS arena_decks (
        id TEXT PRIMARY KEY,
        player_id TEXT NOT NULL REFERENCES arena_players(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        faction_id TEXT NOT NULL,
        cards JSONB NOT NULL DEFAULT '[]'::jsonb,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
    console.log("  + arena_decks");

    await client.query(`
      CREATE TABLE IF NOT EXISTS arena_rooms (
        id TEXT PRIMARY KEY,
        mode TEXT NOT NULL DEFAULT '2p',
        status TEXT NOT NULL DEFAULT 'waiting',
        host_player_id TEXT NOT NULL REFERENCES arena_players(id) ON DELETE CASCADE,
        host_faction_id TEXT NOT NULL,
        host_deck_id TEXT REFERENCES arena_decks(id) ON DELETE SET NULL,
        game_state JSONB,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
    console.log("  + arena_rooms");

    await client.query(`
      CREATE TABLE IF NOT EXISTS arena_room_players (
        room_id TEXT NOT NULL REFERENCES arena_rooms(id) ON DELETE CASCADE,
        player_id TEXT NOT NULL REFERENCES arena_players(id) ON DELETE CASCADE,
        seat INTEGER NOT NULL,
        faction_id TEXT NOT NULL,
        deck_id TEXT REFERENCES arena_decks(id) ON DELETE SET NULL,
        is_ready BOOLEAN NOT NULL DEFAULT FALSE,
        PRIMARY KEY (room_id, player_id)
      )
    `);
    console.log("  + arena_room_players");

    await client.query("COMMIT");
    console.log("\nMigration complete.");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Migration failed:", err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

migrate();

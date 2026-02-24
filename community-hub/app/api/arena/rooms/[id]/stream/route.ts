import pool from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: roomId } = await params;

  const encoder = new TextEncoder();
  let lastUpdatedAt = "";
  let closed = false;

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: string, data: unknown) => {
        if (closed) return;
        try {
          controller.enqueue(
            encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`),
          );
        } catch {
          closed = true;
        }
      };

      const poll = async () => {
        if (closed) return;
        try {
          const { rows } = await pool.query(
            `SELECT status, game_state, updated_at,
                    (SELECT json_agg(json_build_object(
                      'playerId', rp.player_id,
                      'seat', rp.seat,
                      'factionId', rp.faction_id,
                      'isReady', rp.is_ready,
                      'displayName', ap.display_name
                    ) ORDER BY rp.seat)
                    FROM arena_room_players rp
                    JOIN arena_players ap ON ap.id = rp.player_id
                    WHERE rp.room_id = $1) as players
             FROM arena_rooms WHERE id = $1`,
            [roomId],
          );

          if (rows.length === 0) {
            send("error", { message: "Room not found" });
            closed = true;
            controller.close();
            return;
          }

          const row = rows[0];
          const updatedAt = String(row.updated_at);

          if (updatedAt !== lastUpdatedAt) {
            lastUpdatedAt = updatedAt;
            send("update", {
              status: row.status,
              gameState: row.game_state,
              players: row.players ?? [],
              updatedAt,
            });
          }
        } catch (err) {
          console.error("SSE poll error:", err);
        }

        if (!closed) {
          setTimeout(poll, 2000);
        }
      };

      poll();
    },
    cancel() {
      closed = true;
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}

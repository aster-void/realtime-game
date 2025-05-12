import type { LobbyEvent, RoomEvent } from "@repo/share/types.ts";
import { Uuid } from "@repo/share/types.ts";
import { Hono } from "hono";
import { streamSSE } from "hono/streaming";
import { param, query } from "../lib/validator.ts";
import { lobby } from "../model/lobby.ts";
import { rooms } from "../model/rooms.ts";

const route = new Hono()
  .get(
    "/rooms/:room",
    param({
      room: Uuid,
    }),
    async (c) => {
      const param = c.req.valid("param");
      const room = rooms.find((room) => room.id === param.room);
      return streamSSE(c, async (stream) => {
        async function sendMessage(ev: RoomEvent) {
          await stream.writeSSE({
            data: JSON.stringify(ev),
          });
        }

        const unsubscribe = rooms.listen(param.room, sendMessage);
        stream.onAbort(() => {
          unsubscribe();
        });

        while (true) {
          await stream.sleep(8000);
          await sendMessage({
            type: "ping",
          });
        }
      });
    },
  )
  .get(
    "/lobby",
    query({
      userId: Uuid,
    }),
    async (c) => {
      const query = c.req.valid("query");
      return streamSSE(c, async (stream) => {
        async function sendMessage(m: LobbyEvent) {
          await stream.writeSSE({
            data: JSON.stringify(m),
          });
        }
        const unsubscribe = lobby.listen(query.userId, sendMessage);
        stream.onAbort(() => {
          unsubscribe();
        });
        while (true) {
          await stream.sleep(8000);
          await sendMessage({
            type: "ping",
          });
        }
      });
    },
  );

export default route;

import type { LobbyEvent, RoomEvent } from "@repo/share/types.ts";
import { Uuid } from "@repo/share/types.ts";
import { Hono } from "hono";
import { streamSSE } from "hono/streaming";
import * as v from "valibot";
import { rooms } from "../state.ts";
import { lobby } from "../state.ts";
import { param } from "../validator.ts";

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
          console.log(ev);
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
  .get("/lobby", async (c) => {
    return streamSSE(c, async (stream) => {
      async function sendMessage(m: LobbyEvent) {
        await stream.writeSSE({
          data: JSON.stringify(m),
        });
      }
      const unsubscribe = lobby.listen(sendMessage);
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
  });

export default route;

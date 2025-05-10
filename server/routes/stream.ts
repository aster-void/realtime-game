import { LobbyEvent, RoomEvent } from "@repo/share/types.ts";
import { Hono } from "hono";
import { streamSSE } from "hono/streaming";
import { get } from "svelte/store";
import * as v from "valibot";
import { rooms } from "../state.ts";
import { param } from "../validator.ts";

const route = new Hono()
  .get(
    "/rooms/:room",
    param({
      room: v.string(),
    }),
    async (c) => {
      const param = c.req.valid("param");
      const room = rooms.find((room) => get(room).id === param.room);
      if (!room) {
        return;
      }
      return streamSSE(c, async (stream) => {
        async function sendMessage(m: RoomEvent) {
          const parseRes = v.safeParse(RoomEvent, m);
          if (!parseRes.success) {
            console.warn(
              "[warn] failed to parse room event",
              m,
              "for error:",
              parseRes.issues,
            );
            return;
          }
          await stream.writeSSE({
            data: JSON.stringify(parseRes.output),
          });
        }

        const unsubscribe = room.subscribe((room) => {
          sendMessage({
            type: "room update",
            room,
          });
        });
        stream.onAbort(() => {
          unsubscribe();
        });
        while (true) {
          await stream.sleep(8000);
          sendMessage({
            type: "ping",
          });
        }
      });
    },
  )
  .get("/lobby", async (c) => {
    const userId = crypto.randomUUID();

    return streamSSE(c, async (stream) => {
      function sendMessage(m: LobbyEvent) {
        const parseRes = v.safeParse(LobbyEvent, m);
        if (!parseRes.success) {
          console.warn(
            "[warn] failed to parse lobby event",
            m,
            "for error:",
            parseRes.issues,
          );
          return;
        }
        stream.writeSSE({
          data: JSON.stringify(parseRes.output),
        });
      }
      const notify = new BroadcastChannel(`lobby:${userId}`);
      notify.onmessage = (ev) => {
        sendMessage(ev.data);
      };
      stream.onAbort(() => {
        notify.close();
      });
      sendMessage({
        type: "match init",
        matchId: userId,
      });
      stream.onAbort(() => {
        notify.close();
      });

      while (true) {
        await stream.sleep(8000);
        sendMessage({
          type: "ping",
        });
      }
    });
  });

export default route;

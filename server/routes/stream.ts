import { RoomEvent } from "@repo/share/types.ts";
import { Hono } from "hono";
import { streamSSE } from "hono/streaming";
import { get } from "svelte/store";
import * as v from "valibot";
import { matchingUsers, rooms } from "../state.ts";
import { param, query } from "../validator.ts";

const route = new Hono()
  .get(
    "/rooms/:room",
    param({
      room: v.string(),
    }),
    query({
      user: v.string(),
    }),
    async (c) => {
      const param = c.req.valid("param");
      const query = c.req.valid("query");
      const userId = crypto.randomUUID();
      const room = rooms.find((room) => get(room).id === param.room);
      if (!room) {
        return;
      }
      return streamSSE(c, async (stream) => {
        async function sendMessage(m: RoomEvent | unknown) {
          const parseRes = v.safeParse(RoomEvent, m);
          if (!parseRes.success) {
            console.warn("[warn] failed to parse", m);
            return;
          }
          await stream.writeSSE({
            data: JSON.stringify(parseRes.output),
          });
        }

        const unsubscribe = room.subscribe((m) => {
          sendMessage(m);
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
  .get("/lobby", query({}), async (c) => {
    const userId = crypto.randomUUID();
    return streamSSE(c, async (stream) => {
      const notify = new BroadcastChannel(`lobby:${userId}`);
      notify.onmessage = (ev) => {
        stream.writeSSE({
          data: JSON.stringify(ev.data),
        });
      };
      stream.onAbort(() => {
        notify.close();
      });
      while (true) {
        await stream.sleep(8000);
      }
    });
  });

export default route;

import type { Room } from "@repo/share/types";
import { Hono } from "hono";
import { get } from "svelte/store";
import * as v from "valibot";
import { rooms } from "../state";
import { param } from "../validator";
import { json } from "../validator";

const route = new Hono()
  .get("/", (c) => {
    return c.json(rooms.map(get));
  })
  .get(
    "/:id",
    param({
      id: v.string(),
    }),
    async (c) => {
      const param = c.req.valid("param");
      const room = rooms.find((room) => get(room).id === param.id);
      if (!room) {
        return c.notFound();
      }
      return c.json(get(room));
    },
  )
  .patch(
    "/:id",
    param({
      id: v.string(),
    }),
    json(
      v.object({
        user: v.string(),
      }),
    ),
    async (c) => {
      const param = c.req.valid("param");
      const room = rooms.find((room) => get(room).id === param.id);
      if (!room) {
        return c.notFound();
      }
      const json = c.req.valid("json");
      room.update((room) => {
        room.players.push({
          id: crypto.randomUUID(),
          name: json.user,
        });
        return room;
      });
      return c.json(get(room));
    },
  );

export default route;

import { type Room, Uuid } from "@repo/share/types";
import { Hono } from "hono";
import { get, writable } from "svelte/store";
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
  .post(
    "/",
    json(
      v.object({
        roomName: v.string(),
        playerName: v.string(),
      }),
    ),
    async (c) => {
      const json = c.req.valid("json");
      const player = {
        id: crypto.randomUUID(),
        name: json.playerName,
      };
      const room: Room = {
        id: crypto.randomUUID(),
        name: json.roomName,
        players: [player],
      };
      rooms.push(writable(room));
      return c.json({
        room,
        player,
      });
    },
  )
  .patch(
    "/:id",
    param({
      id: v.string(),
    }),
    json(
      v.object({
        userName: v.string(),
      }),
    ),
    async (c) => {
      const param = c.req.valid("param");
      const userId: string = crypto.randomUUID();
      const room = rooms.find((room) => get(room).id === param.id);
      if (!room) {
        return c.notFound();
      }
      const json = c.req.valid("json");
      room.update((room) => {
        room.players.push({
          id: userId,
          name: json.userName,
        });
        return room;
      });
      const roomData: Room = get(room);
      return c.json({
        room: roomData,
        userId,
      });
    },
  );

export default route;

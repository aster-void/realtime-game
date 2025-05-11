import { type Room, Uuid } from "@repo/share/types";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { get } from "svelte/store";
import * as v from "valibot";
import { rooms } from "../state";
import { param } from "../validator";
import { json } from "../validator";

const route = new Hono()
  .get("/", (c) => {
    const data = rooms.current;
    return c.json(data);
  })
  .get(
    "/:id",
    param({
      id: v.string(),
    }),
    async (c) => {
      const param = c.req.valid("param");
      const idx = rooms.findIndex((room) => room.id === param.id);
      return c.json<Room>(rooms.get(idx));
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
      rooms.push(room);
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
      v.union([
        v.object({
          type: v.literal("join"),
          userName: v.string(),
        }),
        v.object({
          type: v.literal("user rename"),
          userId: Uuid,
          userName: v.string(),
        }),
      ]),
    ),
    async (c) => {
      const param = c.req.valid("param");
      const room = rooms.find((room) => room.id === param.id);
      const json = c.req.valid("json");
      switch (json.type) {
        case "join": {
          const userId: string = crypto.randomUUID();
          const idx = rooms.findIndex((room) => room.id === param.id);
          rooms.update(idx, (room) => {
            room.players.push({
              id: userId,
              name: json.userName,
            });
            return room;
          });
          const roomData: Room = rooms.get(idx);
          return c.json({
            room: roomData,
            userId,
          });
        }
        case "user rename": {
          const idx = rooms.findIndex((room) => room.id === param.id);
          rooms.update(idx, (room) => {
            const prev = room.players.find(
              (player) => player.id === json.userId,
            );
            if (!prev) {
              throw new HTTPException(404, {
                message: "player not found",
              });
            }
            prev.name = json.userName;
            return room;
          });
          const roomData: Room = rooms.get(idx);
          return c.json({
            room: roomData,
            userId: json.userId,
          });
        }
      }
    },
  );

export default route;

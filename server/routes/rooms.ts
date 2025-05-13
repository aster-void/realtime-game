import { Hand, type Player, type Room, Uuid } from "@repo/share/types";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import * as v from "valibot";
import { param } from "../lib/validator.ts";
import { json } from "../lib/validator.ts";
import { rooms } from "../model/rooms.ts";

const route = new Hono()
  .get("/", (c) => {
    const data = rooms.all;
    return c.json(data);
  })
  .get(
    "/:id",
    param({
      id: Uuid,
    }),
    async (c) => {
      const param = c.req.valid("param");
      const room = rooms.findById(param.id);
      return c.json<Room>(room);
    },
  )
  .post(
    "/",
    json(
      v.object({
        roomName: v.string(),
        player: v.object({
          id: Uuid,
          name: v.string(),
        }),
      }),
    ),
    async (c) => {
      const json = c.req.valid("json");
      const player: Player = {
        id: json.player.id,
        name: json.player.name,
        action: null,
        dead: false,
        isAI: false,
      };
      const room: Room = {
        id: crypto.randomUUID(),
        name: json.roomName,
        status: {
          type: "waitroom",
          players: [player],
        },
      };
      rooms.push(room);
      return c.json({
        room,
        player,
      });
    },
  )
  .post(
    "/:id/actions",
    param({
      id: Uuid,
    }),
    json(
      v.object({
        action: Hand,
        userId: Uuid,
      }),
    ),
    async (c) => {
      const param = c.req.valid("param");
      const json = c.req.valid("json");
      return c.json({
        room: rooms.makeMove(param.id, json.userId, json.action),
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
          type: v.literal("add player"),
          player: v.object({
            id: Uuid,
            name: v.string(),
            isAI: v.boolean(),
          }),
        }),
        v.object({
          type: v.literal("remove ai"),
          aiId: v.string(),
        }),
        v.object({
          type: v.literal("user rename"),
          userId: Uuid,
          userName: v.string(),
        }),
        v.object({
          type: v.literal("start game"),
        }),
      ]),
    ),
    async (c) => {
      const param = c.req.valid("param");
      const json = c.req.valid("json");
      switch (json.type) {
        case "add player": {
          const room = rooms.findById(param.id);
          rooms.update(room.id, (room) => {
            if (
              room.status.players.find((player) => player.id === json.player.id)
            ) {
              return room;
            }
            const player: Player = {
              ...json.player,
              action: null,
              dead: false,
            };
            room.status.players.push(player);
            return room;
          });
          return c.json({
            room: rooms.findById(param.id),
          });
        }
        case "user rename": {
          const room = rooms.update(param.id, (room) => {
            const prev = room.status.players.find(
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
          return c.json({
            room,
          });
        }
        case "remove ai": {
          const room = rooms.update(param.id, (room) => {
            room.status.players = room.status.players.filter(
              (player) => !(player.isAI && player.id === json.aiId),
            );
            return room;
          });
          return c.json({
            room,
          });
        }
        case "start game": {
          const room = rooms.update(param.id, (room) => {
            room.status = {
              type: "playing",
              submitted: [],
              players: room.status.players.map((player) => ({
                ...player,
                dead: false,
                action: null,
                isAI: player.isAI,
              })),
            };
            rooms.planAIMoves(param.id);
            return room;
          });
          return c.json({
            room,
          });
        }
      }
    },
  );

export default route;

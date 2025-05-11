import { Hand, type Player, type Room, Uuid } from "@repo/share/types";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import * as v from "valibot";
import { unwrap } from "../lib/index.ts";
import { resolve } from "../logic/hands.ts";
import { rooms } from "../model/rooms.ts";
import { param } from "../validator.ts";
import { json } from "../validator.ts";

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
      rooms.update(param.id, (room): Room => {
        if (room.status.type !== "playing") {
          throw new HTTPException(400, {
            message: "room is not playing",
          });
        }
        const player = room.status.players.find(
          (player) => player.id === json.userId,
        );
        if (!player) {
          throw new HTTPException(404, {
            message: "player not found",
          });
        }
        player.action = json.action;
        if (room.status.players.every((player) => player.action !== null)) {
          const result = resolve(room.status.players);
          if (result.status === "end") {
            room.status = {
              type: "end",
              winner: unwrap(result.players.find((player) => !player.dead)),
              players: room.status.players,
            };
            return room;
          }
          room.status = {
            type: "playing",
            submitted: [],
            players: room.status.players,
          };
          return room;
        }
        return room;
      });
      return c.json({
        room: rooms.findById(param.id),
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
          player: v.object({
            id: Uuid,
            name: v.string(),
          }),
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
        case "join": {
          const room = rooms.findById(param.id);
          rooms.update(room.id, (room) => {
            if (room.status.type !== "waitroom") {
              throw new HTTPException(400, {
                message: "room is not waitroom",
              });
            }
            if (
              room.status.players.find((player) => player.id === json.player.id)
            ) {
              return room;
            }
            const player: Player = {
              id: json.player.id,
              name: json.player.name,
              action: null,
              dead: false,
            };
            room.status.players.push(player);
            return room;
          });
          return c.json({
            room,
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
        case "start game": {
          const room = rooms.update(param.id, (room) => {
            room.status = {
              type: "playing",
              submitted: [],
              players: room.status.players.map((player) => ({
                id: player.id,
                name: player.name,
                dead: false,
                action: null,
              })),
            };
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

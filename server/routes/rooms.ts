import { Hand, type Player, type Room, Uuid } from "@repo/share/types";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
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
      const player: Player = {
        id: crypto.randomUUID(),
        name: json.playerName,
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
      id: v.string(),
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
      const idx = rooms.findIndex((room) => room.id === param.id);
      rooms.update(idx, (room) => {
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
          // TOOD: implement logic
          room.status.players[0].dead = true;
        }
        return room;
      });
      return c.json({
        room: rooms.get(idx),
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
          const userId: string = crypto.randomUUID();
          const idx = rooms.findIndex((room) => room.id === param.id);
          rooms.update(idx, (room) => {
            if (room.status.type !== "waitroom") {
              throw new HTTPException(400, {
                message: "room is not waitroom",
              });
            }
            const player: Player = {
              id: userId,
              name: json.userName,
              action: null,
              dead: false,
            };
            room.status.players.push(player);
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
            if (
              room.status.type !== "waitroom" &&
              room.status.type !== "playing"
            ) {
              throw new HTTPException(400, {
                message: "room is not waitroom or playing",
              });
            }
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
          const roomData: Room = rooms.get(idx);
          return c.json({
            room: roomData,
            userId: json.userId,
          });
        }
        case "start game": {
          console.log("starting game");
          const idx = rooms.findIndex((room) => room.id === param.id);
          rooms.update(idx, (room) => {
            if (room.status.type !== "waitroom") {
              console.log(room.status);
              throw new HTTPException(400, {
                message: "room is not waitroom",
              });
            }
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
          const roomData: Room = rooms.get(idx);
          return c.json({
            room: roomData,
          });
        }
      }
    },
  );

export default route;

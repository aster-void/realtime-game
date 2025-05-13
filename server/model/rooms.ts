import { type Hand, type Room, RoomEvent, type Uuid } from "@repo/share/types";
import { HTTPException } from "hono/http-exception";
import { unwrap } from "../lib/index.ts";
import * as ai from "../logic/ai.ts";
import { resolve } from "../logic/hands.ts";
import { isAllSettled } from "../logic/room.ts";
import * as proto from "./_proto.ts";
import { lobby } from "./lobby.ts";
const _rooms = <Room[]>[];

export namespace rooms {
  // read methods
  export const all = _rooms;
  export const find = (where: (room: Room) => boolean): Room => {
    const room = _rooms.find(where);
    if (!room) {
      throw new HTTPException(404, {
        message: "room not found",
      });
    }
    return room;
  };
  export const findById = (id: string): Room => {
    const room = find((room) => room.id === id);
    return room;
  };
  export const findIndex = (where: (room: Room) => boolean): number => {
    const room = _rooms.findIndex(where);
    if (room === -1) {
      throw new HTTPException(404, {
        message: "room not found",
      });
    }
    return room;
  };

  // mutation
  export const push = (room: Room): void => {
    _rooms.push(room);
    lobby.notify({
      type: "room create",
      room,
    });
  };
  export const set = (id: string, room: Room): void => {
    const index = _rooms.findIndex((room) => room.id === id);
    if (index === -1) {
      throw new HTTPException(404, {
        message: "room not found",
      });
    }
    _rooms[index] = room;
    notify(id, {
      type: "room update",
      room,
    });
    lobby.notify({
      type: "room update",
      id,
      room,
    });
  };
  export const update = (id: string, fn: (room: Room) => Room): Room => {
    const prev = findById(id);
    const room = fn(prev);
    set(id, room);
    return room;
  };

  export function makeMove(roomId: Uuid, playerId: Uuid, action: Hand): Room {
    return rooms.update(roomId, (room) => {
      if (room.status.type !== "playing") {
        throw new HTTPException(400, {
          message: "room is not playing",
        });
      }
      const player = room.status.players.find(
        (player) => player.id === playerId,
      );
      if (!player) {
        throw new HTTPException(404, {
          message: "player not found",
        });
      }
      if (player.action) {
        throw new HTTPException(400, {
          message: "player already made a move",
        });
      }
      player.action = action;

      if (!isAllSettled(room.status.players)) {
        return room;
      }

      const result = resolve(room.status.players);
      if (result.status === "end") {
        setTimeout(() => {
          rooms.update(roomId, (room) => {
            room.status = {
              type: "end",
              winner: unwrap(
                room.status.players.find((player) => !player.dead),
              ),
              players: room.status.players,
            };
            return room;
          });
        }, 500);
        return room;
      }
      setTimeout(() => {
        rooms.update(roomId, (room) => {
          room.status = {
            type: "playing",
            submitted: [],
            players: room.status.players.map((player) => ({
              ...player,
              action: player.dead ? player.action : null,
            })),
          };
          planAIMoves(roomId);
          return room;
        });
      }, 500);
      return room;
    });
  }
  export function planAIMoves(roomId: Uuid) {
    ai.planAIMoves(
      rooms.findById(roomId).status.players,
      1500,
      (playerId, action) => {
        rooms.makeMove(roomId, playerId, action);
      },
    );
  }

  // pub / sub methods
  export const notify = (id: string, message: RoomEvent): void => {
    proto.post(`room:${id}`, message);
  };
  export const listen = (
    room: string,
    onMessage: (message: RoomEvent) => void,
  ): (() => void) => {
    return proto.listen(`room:${room}`, RoomEvent, onMessage);
  };
}

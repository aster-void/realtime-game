import { type Hand, type Room, RoomEvent, type Uuid } from "@repo/share/types";
import { HTTPException } from "hono/http-exception";
import { unwrap } from "../lib/index.ts";
import * as ai from "../logic/ai.ts";
import { resolve } from "../logic/hands.ts";
import { isAllSettled } from "../logic/room.ts";
import * as persist from "./_persist.ts";
import * as proto from "./_proto.ts";
import { lobby } from "./lobby.ts";

export namespace rooms {
  // read methods
  export async function all() {
    return persist.rooms.loadAll();
  }
  /** This is an expensive method. don't overuse. */
  export async function find(where: (room: Room) => boolean): Promise<Room> {
    const room = persist.rooms.loadAll().find(where);
    if (!room) {
      throw new HTTPException(404, {
        message: "room not found",
      });
    }
    return room;
  }
  export async function findById(id: string): Promise<Room> {
    const room = persist.rooms.load(id);
    if (!room) {
      throw new HTTPException(404, {
        message: "room not found",
      });
    }
    return room;
  }

  // mutation
  export async function push(room: Room): Promise<void> {
    persist.rooms.save(room);
    lobby.notify({
      type: "room create",
      room,
    });
  }
  export async function set(id: string, room: Room): Promise<void> {
    persist.rooms.save(room);
    notify(id, {
      type: "room update",
      room,
    });
    lobby.notify({
      type: "room update",
      id,
      room,
    });
  }
  export async function update(
    id: string,
    fn: (room: Room) => Room,
  ): Promise<Room> {
    const prev = await findById(id);
    const room = fn(prev);
    await set(id, room);
    return room;
  }

  export async function makeMove(
    roomId: Uuid,
    playerId: Uuid,
    action: Hand,
  ): Promise<Room> {
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
  export async function planAIMoves(roomId: Uuid) {
    ai.planAIMoves(
      (await rooms.findById(roomId)).status.players,
      1500,
      (playerId, action) => {
        rooms.makeMove(roomId, playerId, action);
      },
    );
  }

  // pub / sub methods
  export async function notify(id: string, message: RoomEvent): Promise<void> {
    proto.post(`room:${id}`, message);
  }
  export async function listen(
    room: string,
    onMessage: (message: RoomEvent) => void,
  ): Promise<() => void> {
    return proto.listen(`room:${room}`, RoomEvent, onMessage);
  }
}

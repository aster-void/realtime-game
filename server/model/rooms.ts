import { type Room, RoomEvent } from "@repo/share/types";
import { HTTPException } from "hono/http-exception";
import * as v from "valibot";
import { lobby } from "./lobby.ts";
import * as proto from "./proto.ts";

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

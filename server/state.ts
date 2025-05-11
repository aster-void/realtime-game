import { LobbyEvent, RoomEvent } from "@repo/share/types";
import { HTTPException } from "hono/http-exception";
import { writable } from "svelte/store";
import * as v from "valibot";

type Room = {
  id: string;
  name: string;
  players: {
    id: string;
    name: string;
  }[];
};

const _rooms = <Room[]>[];
export const rooms: {
  current: Room[];
  push: (room: Room) => void;
  set: (index: number, room: Room) => void;
  get: (index: number) => Room;
  update: (index: number, room: (room: Room) => Room) => void;
  find: (where: (room: Room) => boolean) => Room;
  findIndex: (where: (room: Room) => boolean) => number;
  listen: (room: string, onMessage: (message: RoomEvent) => void) => () => void;
} = {
  current: _rooms,
  push: (room) => {
    _rooms.push(room);
    const bc = new BroadcastChannel("lobby");
    bc.postMessage(<LobbyEvent>{
      type: "room create",
      room,
    });
    bc.close();
  },
  set: (index, room) => {
    _rooms[index] = room;
    const bc = new BroadcastChannel("lobby");
    bc.postMessage(<LobbyEvent>{
      type: "room update",
      id: room.id,
      room,
    });
    bc.close();
  },
  get: (index) => {
    const room = _rooms[index];
    if (!room) {
      throw new HTTPException(404, {
        message: "room not found",
      });
    }
    return room;
  },
  update: (index, room) => {
    const prev = _rooms[index];
    if (!prev) return;
    _rooms[index] = room(prev);
    rooms.set(index, _rooms[index]);
  },
  find: (where) => {
    const room = _rooms[_rooms.findIndex(where)];
    if (!room) {
      throw new HTTPException(404, {
        message: "room not found",
      });
    }
    return room;
  },
  findIndex: (where) => {
    const idx = _rooms.findIndex(where);
    if (idx === -1) {
      throw new HTTPException(404, {
        message: "room not found",
      });
    }
    return idx;
  },
  listen: (room: string, onMessage: (message: RoomEvent) => void) => {
    const bc = new BroadcastChannel(`lobby:${room}`);
    bc.onmessage = (ev) => {
      const parseRes = v.safeParse(RoomEvent, ev.data);
      if (!parseRes.success) {
        console.warn(
          "[warn] failed to parse room event",
          ev.data,
          "for error:",
          parseRes.issues,
        );
        return;
      }
      onMessage(parseRes.output);
    };
    return () => {
      bc.close();
    };
  },
};
export const lobby = {
  notify: (message: LobbyEvent) => {
    const all = new BroadcastChannel("lobby");
    all.postMessage(message);
    all.close();
  },
  listen: (onMessage: (message: LobbyEvent) => void) => {
    const bc = new BroadcastChannel("lobby");
    bc.onmessage = (ev) => {
      const parseRes = v.safeParse(LobbyEvent, ev.data);
      if (!parseRes.success) {
        console.warn(
          "[warn] failed to parse lobby event",
          ev.data,
          "for error:",
          parseRes.issues,
        );
        return;
      }
      onMessage(parseRes.output);
    };
    return () => {
      bc.close();
    };
  },
};
export const matchingUsers = writable<string[]>([]);

matchingUsers.subscribe((users) => {
  if (users.length >= 2) {
    const players = users.splice(0, 2);
    const room = {
      id: crypto.randomUUID(),
      name: "room",
      players: players.map((id) => ({ id, name: id })),
    };
    rooms.push(room);
    for (const user of players) {
      lobby.notify({
        type: "match success",
        room,
      });
    }
    return [];
  }
  return users;
});

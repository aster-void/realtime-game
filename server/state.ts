import { LobbyEvent, RoomEvent } from "@repo/share/types";
import type { Room } from "@repo/share/types";
import { HTTPException } from "hono/http-exception";
import { writable } from "svelte/store";
import * as v from "valibot";

function post<T>(path: string, data: T) {
  const bc = new BroadcastChannel(path);
  bc.postMessage(data);
  bc.close();
}
function listen<T>(
  path: string,
  schema: v.GenericSchema<T>,
  onMessage: (message: T) => void,
) {
  const bc = new BroadcastChannel(path);
  bc.onmessage = (ev) => {
    const parseRes = v.safeParse(schema, ev.data);
    if (!parseRes.success) {
      console.warn(
        "[warn] failed to parse room event",
        ev.data,
        "for error:",
        parseRes.issues,
      );
    }
    onMessage(ev.data);
  };
  return () => {
    bc.close();
  };
}

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
    lobby.notify({
      type: "room create",
      room,
    });
  },
  set: (index, room) => {
    _rooms[index] = room;
    post<RoomEvent>(`room:${room.id}`, {
      type: "room update",
      id: room.id,
      room,
    });
    lobby.notify({
      type: "room update",
      id: room.id,
      room,
    });
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
    return listen(`room:${room}`, RoomEvent, onMessage);
  },
};
export const lobby = {
  notify: (message: LobbyEvent) => {
    post("lobby", message);
  },
  listen: (onMessage: (message: LobbyEvent) => void) => {
    return listen("lobby", LobbyEvent, onMessage);
  },
};

export const matchingUsers = writable<string[]>([]);

matchingUsers.subscribe((users) => {
  if (users.length >= 2) {
    const players = users.splice(0, 2);
    const room: Room = {
      id: crypto.randomUUID(),
      name: "random match",
      status: {
        type: "waitroom",
        players: players.map((id) => ({
          id,
          name: id,
          dead: false,
          action: null,
        })),
      },
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

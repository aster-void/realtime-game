import type { LobbyEvent } from "@repo/share/types";
import { type Writable, writable } from "svelte/store";

type Room = {
  id: string;
  name: string;
  players: {
    id: string;
    name: string;
  }[];
};

export const rooms = <Writable<Room>[]>[];
export const matchingUsers = writable<string[]>([]);

matchingUsers.subscribe((users) => {
  if (users.length >= 2) {
    const players = users.splice(0, 2);
    const room = {
      id: crypto.randomUUID(),
      name: "room",
      players: players.map((id) => ({ id, name: id })),
    };
    for (const user of players) {
      const notify = new BroadcastChannel(`lobby:${user}`);
      const ev: LobbyEvent = {
        type: "match success",
        room,
      };
      notify.postMessage(ev);
    }
    rooms.push(writable(room));
    return [];
  }
  return users;
});

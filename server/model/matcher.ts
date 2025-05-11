import type { Room } from "@repo/share/types";
import { writable } from "svelte/store";
import { lobby } from "./lobby";
import { rooms } from "./rooms";

const matchingUsers = writable<string[]>([]);
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
      lobby.notify(
        {
          type: "match success",
          room,
        },
        user,
      );
    }
    matchingUsers.set([]);
  }
});

export namespace matcher {
  export function register(id: string) {
    matchingUsers.update((users) => {
      if (users.includes(id)) {
        return users;
      }
      users.push(id);
      return users;
    });
  }
  export function unregister(id: string) {
    matchingUsers.update((users) => {
      if (!users.includes(id)) {
        return users;
      }
      return users.filter((user) => user !== id);
    });
  }
}

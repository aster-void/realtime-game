import type { Room } from "@repo/share/types";
import { matchingUsers as persist } from "./_persist.ts";
import { lobby } from "./lobby";
import { rooms } from "./rooms";

persist.subscribe((users) => {
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
          isAI: false,
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
    persist.set([]);
  }
});

export namespace matcher {
  export function register(id: string) {
    persist.update((users) => {
      if (users.includes(id)) {
        return users;
      }
      users.push(id);
      return users;
    });
  }
  export function unregister(id: string) {
    persist.update((users) => {
      if (!users.includes(id)) {
        return users;
      }
      return users.filter((user) => user !== id);
    });
  }
}

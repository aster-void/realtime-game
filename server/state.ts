import type { Writable } from "svelte/store";

type Room = {
  id: string;
  players: Map<string, string>;
};

export const rooms = <Writable<Room>[]>[];

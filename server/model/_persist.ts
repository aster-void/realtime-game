import type { Room } from "@repo/share/types";
import { writable } from "svelte/store";

export const matchingUsers = writable<string[]>([]);
export const rooms = <Room[]>[];

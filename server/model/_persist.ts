import { Room } from "@repo/share/types";
import { writable } from "svelte/store";
import * as v from "valibot";
import redis from "../api/redis/persist.ts";

export const matchingUsers = writable<string[]>([]);

export namespace rooms {
  export function loadAll() {
    const rooms = redis.hGetAll("rooms");
    if (!rooms) return [];
    return v.parse(v.array(Room), Object.values(rooms));
  }
  export function load(id: string) {
    const room = redis.hGet("rooms", id);
    if (!room) return null;
    return v.parse(Room, room);
  }
  export function save(room: Room) {
    return redis.hSet("rooms", room.id, JSON.stringify(room));
  }
  export function remove(id: string) {
    return redis.hDel("rooms", id);
  }
}

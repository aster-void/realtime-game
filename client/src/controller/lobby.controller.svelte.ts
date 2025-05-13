import { goto } from "$app/navigation";
import { useEventSource } from "$lib/index.ts";
import { LobbyEvent, type Room, type Uuid } from "@repo/share/types";
import type { Client, Fetch } from "~/api/client.ts";
import { createClient } from "~/api/client.ts";
import { API_ENDPOINT } from "~/api/client.ts";
import { useGlobal } from "~/controller/global.svelte.ts";
import { useFetch } from "./_proto";

export type LobbyState =
  | { type: "idle" }
  | {
      type: "matching";
      matchId: Uuid;
    }; // the state "ready" does not exist because as soon as the match is successful, the user is redirected to the room

export class LobbyController {
  global = useGlobal();
  current = $state<LobbyState>({
    type: "idle",
  });
  processing = $state(false);
  rooms = $state<Room[]>([]);
  private client: Client;

  constructor({
    fetch,
    defaultRooms,
  }: {
    fetch: Fetch;
    defaultRooms: Room[];
  }) {
    this.client = createClient({ fetch });
    this.rooms = defaultRooms;
    useEventSource(
      `${API_ENDPOINT}/stream/lobby?userId=${this.global.userId}`,
      LobbyEvent,
      (ev) => {
        switch (ev.type) {
          case "ping":
            break;
          case "room create": {
            this.rooms.push(ev.room);
            break;
          }
          case "room update": {
            const roomIndex = this.rooms.findIndex((room) => room.id === ev.id);
            if (roomIndex === -1) {
              console.warn("room not found", ev.id);
              break;
            }
            this.rooms[roomIndex] = ev.room;
            break;
          }
          case "match success": {
            if (this.current.type !== "matching") {
              console.warn(
                "wrong event type: expected matching, got",
                this.current,
              );
              return;
            }
            goto(`/rooms/${ev.room.id}`);
            break;
          }
          default: {
            console.warn("unknown event type", ev satisfies never);
            break;
          }
        }
      },
    );
  }
  process<T>(fn: () => Promise<T>) {
    this.processing = true;
    return fn()
      .catch((error) => {
        console.error("Error processing:", error);
      })
      .finally(() => {
        this.processing = false;
      });
  }

  requestRandomMatch() {
    return this.process(async () => {
      const matchId = crypto.randomUUID();
      await useFetch(() =>
        this.client.matcher[":id"].$put({
          param: {
            id: matchId,
          },
        }),
      );
      this.current = {
        type: "matching",
        matchId,
      };
    });
  }

  cancelMatch() {
    return this.process(async () => {
      if (this.current.type !== "matching") {
        console.error("match id has not been initialized");
        return;
      }
      const matchId = this.current.matchId;
      await useFetch(() =>
        this.client.matcher[":id"].$delete({
          param: {
            id: matchId,
          },
        }),
      );
      this.current = {
        type: "idle",
      };
    });
  }

  createRoom(roomName: string) {
    return this.process(async () => {
      const { room } = await useFetch(() =>
        this.client.rooms.$post({
          json: {
            roomName,
            player: {
              id: this.global.userId,
              name: this.global.username,
            },
          },
        }),
      );
      if (!room) return;
      await goto(`/rooms/${room.id}`);
    });
  }

  joinRoom(roomId: Uuid) {
    return this.process(async () => {
      const { room } = await useFetch(() =>
        this.client.rooms[":id"].$patch({
          param: {
            id: roomId,
          },
          json: {
            type: "add player",
            player: {
              id: this.global.userId,
              name: this.global.username,
              isAI: false,
            },
          },
        }),
      );
      if (!room) return;
      await goto(`/rooms/${room.id}`);
    });
  }
}

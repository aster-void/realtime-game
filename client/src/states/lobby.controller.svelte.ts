import { LobbyEvent, type Room, type Uuid } from "@repo/share/types";
import { writable } from "svelte/store";
import type { Client } from "~/api/client.ts";
import { createClient } from "~/api/client.ts";
import { useEventSource } from "../lib/useEventSource.ts";

export type LobbyState =
  | { type: "idle" }
  | {
      type: "matching";
      matchId: Uuid;
    }
  | {
      type: "ready";
      room: Room;
    };

export class LobbyController {
  current = $state<LobbyState>({
    type: "idle",
  });
  username = $state<string>("");
  private matchId: Uuid | null = null;
  private client: Client;

  constructor({ fetch }: { fetch: typeof globalThis.fetch }) {
    this.client = createClient({ fetch });
    useEventSource("/lobby", LobbyEvent, (ev) => {
      switch (ev.type) {
        case "ping":
          break;
        case "match init": {
          this.matchId = ev.matchId;
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
          this.current = {
            type: "ready",
            room: ev.room,
          };
          break;
        }
        default: {
          console.warn("unknown event type", ev satisfies never);
          break;
        }
      }
    });
  }

  async requestRandomMatch() {
    await this.client.matcher.$post({
      json: {
        user: this.username,
      },
    });
  }
  async joinRoom(roomId: Uuid) {
    await this.client.rooms[":id"].$patch({
      param: {
        id: roomId,
      },
      json: {
        user: this.username,
      },
    });
  }
}

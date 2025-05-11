import { goto } from "$app/navigation";
import { LobbyEvent, type Room, type Uuid } from "@repo/share/types";
import type { Client, Fetch } from "~/api/client.ts";
import { createClient } from "~/api/client.ts";
import { API_ENDPOINT } from "~/api/client.ts";
import { useEventSource } from "../lib/useEventSource.ts";

export type LobbyState =
  | { type: "idle" }
  | {
      type: "matching";
      matchId: Uuid;
    }; // the state "ready" does not exist because as soon as the match is successful, the user is redirected to the room

export class LobbyController {
  current = $state<LobbyState>({
    type: "idle",
  });
  username = $state<string>("");
  rooms = $state<Room[]>([]);
  private matchId: Uuid | null = null;
  private client: Client;

  constructor({
    fetch,
    defaultRooms,
  }: {
    fetch: Fetch;
    defaultRooms: Room[];
  }) {
    this.client = createClient({ fetch });
    this.rooms = defaultRooms; // TODO: update rooms based on events
    useEventSource(`${API_ENDPOINT}/stream/lobby`, LobbyEvent, (ev) => {
      switch (ev.type) {
        case "ping":
          break;
        case "room create": {
          this.rooms.push(ev.room);
          break;
        }
        case "match init": {
          this.matchId = ev.matchId;
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
    });
  }

  async requestRandomMatch() {
    if (!this.matchId) {
      console.error("match id has not been initialized");
      return;
    }
    await this.client.matcher.$post({
      json: {
        id: this.matchId,
      },
    });
  }
  async createRoom(roomName: string) {
    const playerName = "aster"; // TODO: get from user
    const res = await this.client.rooms.$post({
      json: {
        roomName,
        playerName,
      },
    });
    const { room } = await res.json();
    console.log("created room", room);
    goto(`/rooms/${room.id}`);
  }
  async joinRoom(roomId: Uuid) {
    const res = await this.client.rooms[":id"].$patch({
      param: {
        id: roomId,
      },
      json: {
        type: "join",
        userName: this.username,
      },
    });
    const { room }: { room: Room } = await res.json();
    goto(`/rooms/${room.id}`);
  }
}

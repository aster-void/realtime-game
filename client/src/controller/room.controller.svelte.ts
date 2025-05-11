import { browser } from "$app/environment";
import { type Hand, type Room, RoomEvent, type Uuid } from "@repo/share/types";
import { useDebounce } from "runed";
import { onMount } from "svelte";
import { API_ENDPOINT, createClient } from "~/api/client.ts";
import { useEventSource } from "../lib/useEventSource.ts";
import { onServerEvent } from "./room.updater.ts";

export type RoomState =
  | {
      // used for named match.
      status: "waitroom";
      room: Room;
    }
  | {
      status: "game";
      room: Room;
      players: {
        id: Uuid;
        name: string;
        hand: Hand | null;
        dead: boolean;
      }[];
    }
  | {
      status: "end";
      room: Room;
      winner: {
        id: Uuid;
        name: string;
      };
    };

export class RoomController {
  private api = createClient({ fetch });

  state: RoomState | undefined = $state();
  private userId: Uuid | undefined = $state();

  updateUsername = useDebounce((username: string) => {
    if (!this.userId || !this.state?.room) return;
    this.api.rooms[":id"].$patch({
      param: {
        id: this.state.room.id,
      },
      json: {
        type: "user rename",
        userId: this.userId,
        userName: username,
      },
    });
  }, 1000);

  constructor(room: Room) {
    this.state = {
      status: "waitroom",
      room,
    };
    if (browser) {
      useEventSource(
        `${API_ENDPOINT}/stream/rooms/${room.id}`,
        RoomEvent,
        (ev) => {
          console.log("room update", this.state);
          if (!this.state) return;
          this.state = onServerEvent(this.state, ev);
        },
      );
    }
    onMount(() => {
      // TODO: implement heart beat
    });
  }
}

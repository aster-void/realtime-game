import { browser } from "$app/environment";
import { type Hand, type Room, RoomEvent, type Uuid } from "@repo/share/types";
import { useDebounce } from "runed";
import { onMount } from "svelte";
import { untrack } from "svelte";
import { API_ENDPOINT, createClient } from "~/api/client.ts";
import { useEventSource } from "../lib/useEventSource.ts";
import { onServerEvent } from "./room.updater.ts";

export class RoomController {
  private api = createClient({ fetch });
  state: Room | undefined = $state();
  userId: Uuid | undefined = $state();

  startGame = () => {
    if (!this.state) return;
    this.api.rooms[":id"].$patch({
      param: {
        id: this.state.id,
      },
      json: {
        type: "start game",
      },
    });
  };

  action(action: Hand) {
    if (!this.state || !this.userId) return;
    this.api.rooms[":id"].actions.$post({
      param: {
        id: this.state.id,
      },
      json: {
        action,
        userId: this.userId,
      },
    });
  }

  #updateUsername = useDebounce((username: string) => {
    if (!this.userId || !this.state) return;
    this.api.rooms[":id"].$patch({
      param: {
        id: this.state.id,
      },
      json: {
        type: "user rename",
        userId: this.userId,
        userName: username,
      },
    });
  }, 1000);

  updateUsername = (name: string) => untrack(() => this.#updateUsername(name));

  constructor(room: Room) {
    this.state = room;

    if (browser) {
      useEventSource(
        `${API_ENDPOINT}/stream/rooms/${room.id}`,
        RoomEvent,
        (ev) => {
          if (!this.state) return; // something went wrong
          this.state = onServerEvent(this.state, ev);
        },
      );
    }

    onMount(() => {
      // TODO: implement heart beat
      return () => {
        // Cleanup if needed
      };
    });
  }
}

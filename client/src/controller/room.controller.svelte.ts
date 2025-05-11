import { browser } from "$app/environment";
import { type Hand, type Room, RoomEvent, type Uuid } from "@repo/share/types";
import { useDebounce } from "runed";
import { onMount } from "svelte";
import { untrack } from "svelte";
import { API_ENDPOINT, createClient } from "~/api/client.ts";
import { useGlobal } from "~/controller/global.svelte";
import { useEventSource } from "../lib/useEventSource.ts";
import { onServerEvent } from "./room.updater.ts";

export class RoomController {
  private api = createClient({ fetch });
  private global = useGlobal();
  state = $state<Room>();
  processing = $state(false);
  process<T>(fn: () => Promise<T>) {
    this.processing = true;
    return fn().finally(() => {
      this.processing = false;
    });
  }
  startGame() {
    return this.process(async () => {
      if (!this.state) return;
      await this.api.rooms[":id"].$patch({
        param: {
          id: this.state.id,
        },
        json: {
          type: "start game",
        },
      });
    });
  }

  action(action: Hand) {
    return this.process(async () => {
      if (!this.state) return;
      await this.api.rooms[":id"].actions.$post({
        param: {
          id: this.state.id,
        },
        json: {
          action,
          userId: this.global.userId,
        },
      });
    });
  }

  #updateUsername = useDebounce((username: string) => {
    return this.process(async () => {
      if (!this.state) return;
      if (username.trim().length === 0) return;
      await this.api.rooms[":id"].$patch({
        param: {
          id: this.state.id,
        },
        json: {
          type: "user rename",
          userId: this.global.userId,
          userName: username,
        },
      });
    });
  }, 200);

  updateUsername = (name: string) => untrack(() => this.#updateUsername(name));

  constructor(room: Room) {
    this.state = room;

    if (browser) {
      useEventSource(
        `${API_ENDPOINT}/stream/rooms/${room.id}`,
        RoomEvent,
        (ev) => {
          if (!this.state) return;
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

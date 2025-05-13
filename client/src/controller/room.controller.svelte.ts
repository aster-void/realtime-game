import { browser } from "$app/environment";
import { randomString, useEventSource } from "$lib/index.ts";
import { type Hand, type Room, RoomEvent } from "@repo/share/types";
import { useDebounce } from "runed";
import { onMount } from "svelte";
import { untrack } from "svelte";
import { API_ENDPOINT, createClient } from "~/api/client.ts";
import { useGlobal } from "~/controller/global.svelte.ts";
import { onServerEvent } from "./room.updater.ts";

export class RoomController {
  private api = createClient({ fetch });
  private global = useGlobal();
  state = $state<Room>();
  processing = $state(false);
  aiName = $state("");

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

  addAI() {
    let aiName = this.aiName.trim();
    if (!aiName) {
      aiName = `AI ${randomString(6, { lower: true })}`;
    }

    return this.process(async () => {
      if (!this.state) return;
      try {
        await this.api.rooms[":id"].$patch({
          param: {
            id: this.state.id,
          },
          json: {
            type: "add player",
            player: {
              id: crypto.randomUUID(),
              name: aiName,
              isAI: true,
            },
          },
        });

        this.aiName = "";
      } catch (error) {
        console.error("Error adding AI player:", error);
      }
    });
  }

  removeAI(aiId: string) {
    return this.process(async () => {
      if (!this.state) return;
      try {
        await this.api.rooms[":id"].$patch({
          param: {
            id: this.state.id,
          },
          json: {
            type: "remove ai",
            aiId,
          },
        });
      } catch (error) {
        console.error("Error removing AI player:", error);
      }
    });
  }
}

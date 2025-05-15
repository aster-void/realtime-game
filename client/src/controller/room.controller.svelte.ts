import { browser } from "$app/environment";
import { randomString, useEventSource } from "$lib/index.ts";
import { type Hand, type Room, RoomEvent } from "@repo/share/types";
import { useDebounce } from "runed";
import { onMount } from "svelte";
import { untrack } from "svelte";
import { API_ENDPOINT, createClient } from "~/api/client.ts";
import { useGlobal } from "~/controller/global.svelte.ts";
import { useFetch } from "./_proto.ts";
import { onServerEvent } from "./updater/room.ts";

export class RoomController {
  private api = createClient({ fetch });
  private global = useGlobal();
  state = $state<Room>(); // this should never be null (see constructor)
  players = $derived.by(() => {
    const clone = this.state?.status.players.slice();
    if (!clone) return []; // this should not happen
    return clone
      .sort((a, b) => {
        if (a.dead && !b.dead) return 1;
        if (!a.dead && b.dead) return -1;
        return 0;
      })
      .sort((a, b) => {
        if (a.id === this.global.userId) return -1;
        if (b.id === this.global.userId) return 1;
        return 0;
      });
  });
  me = $derived(
    this.state?.status.players?.find(
      (player) => player.id === this.global.userId,
    ),
  );
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

  async process<T>(fn: () => Promise<T>) {
    this.processing = true;
    return fn()
      .catch((error) => {
        console.error("Error processing:", error);
      })
      .finally(() => {
        this.processing = false;
      });
  }

  startGame() {
    return this.process(async () => {
      const state = this.state;
      if (!state) return;
      await useFetch(() =>
        this.api.rooms[":id"].$patch({
          param: {
            id: state.id,
          },
          json: {
            type: "start game",
          },
        }),
      );
    });
  }

  action(action: Hand) {
    return this.process(async () => {
      const state = this.state;
      if (!state) return;
      await useFetch(() =>
        this.api.rooms[":id"].actions.$post({
          param: {
            id: state.id,
          },
          json: {
            action,
            userId: this.global.userId,
          },
        }),
      );
    });
  }

  #updateUsername = useDebounce((username: string) => {
    return this.process(async () => {
      const state = this.state;
      if (!state) return;
      if (username.trim().length === 0) return;
      await useFetch(() =>
        this.api.rooms[":id"].$patch({
          param: {
            id: state.id,
          },
          json: {
            type: "user rename",
            userId: this.global.userId,
            userName: username,
          },
        }),
      );
    });
  }, 200);

  updateUsername = (name: string) => untrack(() => this.#updateUsername(name));

  addAI() {
    let aiName = this.aiName.trim();
    if (!aiName) {
      aiName = `AI ${randomString(6, { lower: true })}`;
    }

    return this.process(async () => {
      const state = this.state;
      if (!state) return;
      await useFetch(() =>
        this.api.rooms[":id"].$patch({
          param: {
            id: state.id,
          },
          json: {
            type: "add player",
            player: {
              id: crypto.randomUUID(),
              name: aiName,
              isAI: true,
            },
          },
        }),
      );
      this.aiName = "";
    });
  }

  removeAI(aiId: string) {
    return this.process(async () => {
      const state = this.state;
      if (!state) return;
      await useFetch(() =>
        this.api.rooms[":id"].$patch({
          param: {
            id: state.id,
          },
          json: {
            type: "remove ai",
            aiId,
          },
        }),
      );
    });
  }
}

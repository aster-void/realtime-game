import { Context } from "runed";
import { type Hand, RespGlobalEvent, type Room, type Uuid } from "share/types";
import { onMount } from "svelte";
import * as v from "valibot";
import { onServerEvent } from "./controller.ts";

export type GlobalState =
  | {
      // when player joins, they are greeted with this page.
      status: "lobby";
      rooms: Room[] | null; // null while loading.
    }
  | {
      // used for random match.
      status: "matching";
    }
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
      winner: string;
    };

const globalStateContext = new Context<GlobalState>("globalState");
export function useStateProvider() {
  const globalState: GlobalState = {
    status: "lobby",
    rooms: null,
  };
  globalStateContext.set(globalState);

  onMount(() => {
    const src = new EventSource("/stream");
    src.onmessage = (_ev) => {
      onServerEvent(globalState, v.parse(RespGlobalEvent, _ev.data));
    };
  });
}
export function useState() {
  return globalStateContext.get();
}

import { type Hand, type Room, RoomEvent, type Uuid } from "@repo/share/types";
import { writable } from "svelte/store";
import { API_ENDPOINT } from "~/api/client.ts";
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

export function useRoomState(room: Room) {
  const roomState = writable<RoomState>({
    status: "waitroom",
    room,
  });

  useEventSource(`${API_ENDPOINT}/stream/rooms/${room.id}`, RoomEvent, (ev) => {
    console.log("[room/sse]", ev);
    onServerEvent(roomState, ev);
  });

  return roomState;
}

import type { RoomEvent } from "@repo/share/types";
import type { RoomState } from "./room.controller.svelte.ts";

export function onServerEvent(state: RoomState, ev: RoomEvent): RoomState {
  switch (ev.type) {
    // break -> no action
    case "ping": {
      break;
    }
    case "room update": {
      state.room = ev.room;
      return state;
    }
    case "player submit": {
      if (state.status !== "game") {
        console.warn("wrong event type: expected game, got", state);
        break;
      }
      const action = ev.action;
      for (let i = 0; i < state.room.players.length; i++) {
        if (state.players[i].id === action.playerId) {
          state.players[i].hand = action.hand;
          break;
        }
        console.warn("player not found", action.playerId);
      }
      return state;
    }
    case "next stage": {
      if (state.status !== "game") {
        console.warn("wrong event type: expected game, got", state);
        return state;
      }
      const stage = ev.stage;
      for (let i = 0; i < state.players.length; i++) {
        if (stage.dead.includes(state.players[i].id)) {
          state.players[i].dead = true;
        } else {
          state.players[i].hand = null;
        }
      }
      break;
    }
    case "game end": {
      if (state.status !== "game") {
        console.warn("wrong event type: expected game, got", state);
        break;
      }
      return {
        room: state.room,
        status: "end",
        winner: {
          id: ev.winner.id,
          name: ev.winner.name,
        },
      };
    }
    default: {
      console.warn("unknown event type", ev satisfies never);
      break;
    }
  }
  return state;
}

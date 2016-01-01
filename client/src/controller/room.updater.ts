import type { Room, RoomEvent } from "@repo/share/types";

export function onServerEvent(state: Room, ev: RoomEvent): Room {
  switch (ev.type) {
    // break -> no action
    case "ping": {
      break;
    }
    case "room update": {
      return ev.room;
    }
    case "player submit": {
      if (state.status.type !== "playing") {
        console.warn("wrong event type: expected playing, got", state);
        return state;
      }
      const action = ev.action;
      for (let i = 0; i < state.status.players.length; i++) {
        state.status.submitted.push(action.hand);
      }
      return state;
    }
    case "next stage": {
      if (state.status.type !== "playing") {
        console.warn("wrong event type: expected playing, got", state);
        return state;
      }
      const stage = ev.stage;
      for (let i = 0; i < state.status.players.length; i++) {
        if (stage.dead.includes(state.status.players[i].id)) {
          state.status.players[i].dead = true;
        }
      }
      return state;
    }
    case "end": {
      if (state.status.type !== "playing") {
        console.warn("wrong event type: expected playing, got", state);
        break;
      }
      return {
        ...state,
        status: {
          type: "end",
          winner: {
            id: ev.winner.id,
            name: ev.winner.name,
          },
          players: state.status.players,
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

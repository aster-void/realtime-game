import type { RespGlobalEvent } from "share/types";
import type { GlobalState } from "./global.svelte.ts";

export function onServerEvent(globalState: GlobalState, ev: RespGlobalEvent) {
  switch (ev.type) {
    case "waitroom": {
      if (globalState.status !== "waitroom") return;
      const evt = ev.content;
      switch (evt.type) {
        case "player join": {
          globalState.room.players.push(evt.joined);
          break;
        }
        case "player leave": {
          globalState.room.players = globalState.room.players.filter(
            (p) => p.id !== evt.left,
          );
          break;
        }
        case "room name change": {
          globalState.room.name = evt.to;
          break;
        }
        case "game start": {
          // TODO: satisfy typescript
          globalState.status = "game";
          break;
        }
      }
      break;
    }
    case "match": {
      globalState.status = "matching";
      break;
    }
    case "game": {
      if (globalState.status !== "game") return;
      switch (ev.content.type) {
        case "play": {
          for (let i = 0; i < globalState.players.length; i++) {
            if (globalState.players[i].id === ev.content.player) {
              globalState.players[i].hand = ev.content.hand;
              break;
            }
          }
          break;
        }
        case "continue": {
          for (let i = 0; i < globalState.players.length; i++) {
            if (ev.content.dead.includes(globalState.players[i].id)) {
              globalState.players[i].dead = true;
            } else {
              globalState.players[i].hand = null;
            }
          }
          break;
        }
      }
      break;
    }
  }
}

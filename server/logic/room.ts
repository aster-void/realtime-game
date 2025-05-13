import type { Player } from "@repo/share/types";

export function isAllSettled(players: Player[]) {
  return players.every((player) => player.action !== null || player.dead);
}

import type { Player } from "@repo/share/types";

const hands = ["グー", "チョキ", "パー"];
export function resolve(players: Player[]) {
  const alive = players.filter((player) => !player.dead);
  // If players have at least one of each hand, the game continues.
  if (hands.every((hand) => alive.some((player) => player.action === hand))) {
    return {
      status: "continue",
      players,
    };
  }
  // If all players have the same hand, the game continues.
  for (const hand of hands) {
    if (alive.every((player) => player.action === hand)) {
      return {
        status: "continue",
        players,
      };
    }
  }
  for (let i = 0; i < hands.length; i++) {
    const hand = hands[i];
    const next = hands[(i + 1) % hands.length];
    if (alive.some((player) => player.action === hand)) {
      for (const player of alive) {
        if (player.action === next) {
          player.dead = true;
        }
      }
    }
  }
  return {
    status: count(alive, (player) => !player.dead) === 1 ? "end" : "continue",
    players,
  };
}

function count(players: Player[], cond: (player: Player) => boolean) {
  let count = 0;
  for (const player of players) {
    if (cond(player)) {
      count++;
    }
  }
  return count;
}

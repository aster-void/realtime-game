import type { Player } from "@repo/share/types";
import type { Hand } from "@repo/share/types";
import { panic } from "../lib";

/**
 * Generates a random hand for an AI player
 */
export function getRandomHand(): Hand {
  const hands: Hand[] = ["グー", "チョキ", "パー"];
  const randomIndex = Math.floor(Math.random() * hands.length);
  return hands[randomIndex] ?? panic("impossible state reached");
}

/**
 * Makes a move for all AI players in the room
 * @returns Array of updated players with AI moves
 */
export function makeAIMoves(players: Player[]): Player[] {
  return players.map((player) => {
    if (player.isAI && !player.dead && player.action === null) {
      player.action = getRandomHand();
    }
    return player;
  });
}

/**
 * Creates a new AI player
 */
export function createAIPlayer(name: string): Player {
  return {
    id: `ai-${crypto.randomUUID()}`,
    name: `🤖 ${name}`,
    dead: false,
    action: null,
    isAI: true,
  };
}

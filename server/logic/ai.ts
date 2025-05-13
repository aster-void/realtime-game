import type { Player } from "@repo/share/types";
import type { Hand } from "@repo/share/types";
import { panic, random } from "../lib/index.ts";

/**
 * Generates a random hand for an AI player
 */
export function getRandomHand(): Hand {
  const hands: Hand[] = ["グー", "チョキ", "パー"];
  const randomIndex = random(0, hands.length - 1);
  return hands[randomIndex] ?? panic("impossible state reached");
}

/**
 * Makes a move for all AI players in the room
 * @returns Array of updated players with AI moves
 */
export function planAIMoves(
  players: Player[],
  maxTimeout: number,
  onMove: (playerId: string, action: Hand) => void,
) {
  for (const player of players) {
    if (player.isAI && !player.dead && player.action === null) {
      setTimeout(
        () => {
          const action = getRandomHand();
          onMove(player.id, action);
        },
        random(0, maxTimeout),
      );
    }
  }
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

import { expect, test } from "bun:test";
import { Hand, type Player } from "@repo/share/types";
import * as v from "valibot";
import { resolve } from "../logic/hands";

function createPlayer(action: string): Player {
  v.assert(Hand, action);
  return {
    name: "player",
    id: crypto.randomUUID(),
    dead: false,
    action,
    isAI: false,
  };
}

test("all players have the same hand, the game continues", () => {
  const players = ["グー", "グー", "グー"].map(createPlayer);
  const result = resolve(players);
  expect(result.players.filter((p) => !p.dead).length).toBe(3);
});

test("all players have different hands, the game continues", () => {
  const players = ["グー", "チョキ", "パー"].map(createPlayer);
  const result = resolve(players);
  expect(result.players.map((p) => p.dead)).toEqual([false, false, false]);
});

test("one player has グー, one player has チョキ, one player has パー, the game continues", () => {
  const players = ["グー", "チョキ", "パー"].map(createPlayer);
  const result = resolve(players);
  expect(result.players.map((p) => p.dead)).toEqual([false, false, false]);
});

test("two players have グー, one player has チョキ, the game continues", () => {
  const players = ["グー", "グー", "チョキ"].map(createPlayer);
  const result = resolve(players);
  expect(result.players.map((p) => p.dead)).toEqual([false, false, true]);
});

test("two players have チョキ, one player has パー, the game continues", () => {
  const players = ["チョキ", "チョキ", "パー"].map(createPlayer);
  const result = resolve(players);
  expect(result.players.map((p) => p.dead)).toEqual([false, false, true]);
});

test("two players have パー, one player has グー, the game continues", () => {
  const players = ["パー", "パー", "グー"].map(createPlayer);
  const result = resolve(players);
  expect(result.players.map((p) => p.dead)).toEqual([false, false, true]);
});

test("one player has パー, two player has グー, the game ends", () => {
  const players = ["パー", "グー", "グー"].map(createPlayer);
  const result = resolve(players);
  expect(result.players.map((p) => p.dead)).toEqual([false, true, true]);
  expect(result.status).toBe("end");
});

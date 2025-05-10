import {
  type InferOutput,
  array,
  literal,
  object,
  picklist,
  pipe,
  string,
  tuple,
  union,
  uuid,
} from "valibot";

export type Hand = InferOutput<typeof Hand>;
export const Hand = picklist(["グー", "チョキ", "パー"]);
export type Uuid = InferOutput<typeof Uuid>;
export const Uuid = pipe(string(), uuid());

export type RespGameEvent = InferOutput<typeof RespGameEvent>;
export const RespGameEvent = union([
  object({
    type: literal("play"),
    player: Uuid,
    hand: Hand,
  }),
  object({
    type: literal("continue"),
    dead: array(Uuid),
  }),
]);

export type Room = InferOutput<typeof Room>;
export const Room = object({
  id: pipe(string(), uuid()),
  name: string(),
  players: array(object({ name: string(), id: Uuid })),
});

export type RespMatchEvent = InferOutput<typeof RespMatchEvent>;
export const RespMatchEvent = object({
  room: Room,
});
export type WaitRoomEvent = InferOutput<typeof WaitRoomEvent>;
export const WaitRoomEvent = union([
  object({
    type: literal("player join"),
    joined: object({
      name: string(),
      id: Uuid,
    }),
  }),
  object({
    type: literal("player leave"),
    left: Uuid,
  }),
  object({
    type: literal("room name change"),
    to: string(),
  }),
  object({
    type: literal("game start"),
  }),
]);

export type RespGlobalEvent = InferOutput<typeof RespGlobalEvent>;
export const RespGlobalEvent = union([
  object({
    type: literal("transition"),
    to: picklist(["lobby", "matching", "waitroom", "game", "end"]),
  }),
  object({
    type: literal("match"),
    content: RespMatchEvent,
  }),
  object({
    type: literal("waitroom"),
    content: WaitRoomEvent,
  }),
  object({
    type: literal("game"),
    content: RespGameEvent,
  }),
]);

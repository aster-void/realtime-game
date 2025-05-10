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

export type ActionEvent = InferOutput<typeof ActionEvent>;
export const ActionEvent = object({
  playerId: Uuid,
  hand: Hand,
});
export type RoomEvent = InferOutput<typeof RoomEvent>;
export const RoomEvent = union([
  object({
    type: literal("ping"),
  }),
  object({
    type: literal("room update"),
    room: Room,
  }),
  object({
    type: literal("player submit"),
    action: ActionEvent,
  }),
  object({
    type: literal("next stage"),
    stage: object({
      dead: array(Uuid),
    }),
  }),
  object({
    type: literal("game end"),
    winner: object({
      id: Uuid,
      name: string(),
    }),
  }),
]);

export type LobbyEvent = InferOutput<typeof LobbyEvent>;
export const LobbyEvent = union([
  object({
    type: literal("ping"),
  }),
  object({
    type: literal("match success"),
    room: Room,
  }),
  object({
    type: literal("match init"),
    matchId: Uuid,
  }),
]);

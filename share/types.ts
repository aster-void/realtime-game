import {
  type InferOutput,
  array,
  boolean,
  literal,
  null_,
  object,
  picklist,
  pipe,
  string,
  union,
  uuid,
} from "valibot";

export type Hand = InferOutput<typeof Hand>;
export const Hand = picklist(["グー", "チョキ", "パー"]);
export type Uuid = InferOutput<typeof Uuid>;
export const Uuid = pipe(string(), uuid());

export type Player = InferOutput<typeof Player>;
export const Player = object({
  name: string(),
  id: Uuid,
  dead: boolean(),
  action: union([Hand, null_()]),
});
export type Room = InferOutput<typeof Room>;
export const Room = object({
  id: pipe(string(), uuid()),
  name: string(),
  status: union([
    object({
      type: literal("waitroom"),
      players: array(Player),
    }),
    object({
      type: literal("playing"),
      submitted: array(Hand),
      players: array(Player),
    }),
    object({
      type: literal("end"),
      winner: object({ id: Uuid, name: string() }),
      players: array(Player),
    }),
  ]),
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
    type: literal("end"),
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
    type: literal("room create"),
    room: Room,
  }),
  object({
    type: literal("room update"),
    id: Uuid,
    room: Room,
  }),
  object({
    type: literal("match success"),
    room: Room,
  }),
]);

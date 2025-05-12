import { vValidator } from "@hono/valibot-validator";
import {
  type BaseIssue,
  type GenericSchema,
  type ObjectEntries,
  object,
} from "valibot";

export function json<I, O>(schema: GenericSchema<I, O, BaseIssue<unknown>>) {
  return vValidator("json", schema);
}
export function query<T extends ObjectEntries>(schema: T) {
  return vValidator("query", object(schema));
}
export function param<T extends ObjectEntries>(schema: T) {
  return vValidator("param", object(schema));
}
export function header<T extends ObjectEntries>(schema: T) {
  return vValidator("header", object(schema));
}

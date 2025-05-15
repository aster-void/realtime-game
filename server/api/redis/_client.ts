import { createClient } from "redis";
import { env } from "../../lib/index.ts";

const REDIS_URL = env("REDIS_URL");

export const subscriber = await createClient({
  url: REDIS_URL,
}).connect();
export const publisher = await createClient({
  url: REDIS_URL,
}).connect();
export const persist = await createClient({
  url: REDIS_URL,
}).connect();

export const PUBSUB_REDIS_CHANNEL = "realtime";

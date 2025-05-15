import * as v from "valibot";
import { PUBSUB_REDIS_CHANNEL, publisher, subscriber } from "./_client.ts";

// managing subscribers locally to avoid clogging Redis server
const subscribers = new Map<string, Set<(message: unknown) => void>>();
export function subscribe(id: string, onMessage: (message: unknown) => void) {
  let receiver = subscribers.get(id);
  if (!receiver) {
    receiver = new Set();
    subscribers.set(id, receiver);
  }
  receiver.add(onMessage);

  return () => {
    receiver.delete(onMessage);
    if (receiver.size === 0) {
      subscribers.delete(id);
    }
  };
}

export async function publish(id: string, message: unknown) {
  await publisher.publish(
    PUBSUB_REDIS_CHANNEL,
    JSON.stringify({
      id,
      message,
    }),
  );
}

const RedisMessageSchema = v.object({
  id: v.string(),
  message: v.unknown(),
});

// subscribe globally, once
subscriber.subscribe(PUBSUB_REDIS_CHANNEL, (message) => {
  const data = v.parse(RedisMessageSchema, JSON.parse(message));
  const receiver = subscribers.get(data.id);
  if (!receiver) return;
  for (const onMessage of receiver) {
    onMessage(data.message);
  }
});

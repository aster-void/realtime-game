import { expect, mock, test } from "bun:test";
import * as redis from "./pubsub.ts";

test("redis sets and gets a value", async () => {
  const fn1 = mock(() => {});
  const fn2 = mock(() => {});
  redis.subscribe("test-key", fn1);
  redis.subscribe("test-key", fn2);
  await redis.publish("test-key", "test-value");
  await Bun.sleep(100);
  expect(fn1).toHaveBeenCalledTimes(1);
  expect(fn2).toHaveBeenCalledTimes(1);
  await redis.publish("test-key", "test-value");
  await Bun.sleep(100);
  expect(fn1).toHaveBeenCalledTimes(2);
  expect(fn2).toHaveBeenCalledTimes(2);
});

test("sending to random channel doesn't throw", async () => {
  expect(() => redis.publish("random-key", "random-value")).not.toThrow();
});

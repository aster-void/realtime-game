import { Hono } from "hono";
import { streamSSE } from "hono/streaming";

const route = new Hono().get("/", async (c) => {
  return streamSSE(c, async (stream) => {
    while (true) {
      await stream.sleep(8000);
    }
  });
});

export default route;

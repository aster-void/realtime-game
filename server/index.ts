import { Hono } from "hono";
import { cors } from "hono/cors";
import { env } from "./lib/lib.ts";
import matcherRoute from "./routes/matcher.ts";
import roomsRoute from "./routes/rooms.ts";
import streamRoute from "./routes/stream.ts";

const app = new Hono()
  .use(cors({ origin: env("CORS_ALLOW_ORIGINS").split(",") }))
  .route("/stream", streamRoute)
  .route("/rooms", roomsRoute)
  .route("/matcher", matcherRoute);

export type App = typeof app;
export default app;

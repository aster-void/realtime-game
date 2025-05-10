import { Hono } from "hono";
import matcherRoute from "./routes/matcher.ts";
import roomsRoute from "./routes/rooms.ts";
import streamRoute from "./routes/stream.ts";

const app = new Hono()
  .route("/stream", streamRoute)
  .route("/rooms", roomsRoute)
  .route("/matcher", matcherRoute);

export type App = typeof app;
export default app;

import { Hono } from "hono";
import * as v from "valibot";
import { param } from "../validator";

const route = new Hono().post(
  "/:user",
  param({
    user: v.string(),
  }),
  async (c) => {},
);
export default route;

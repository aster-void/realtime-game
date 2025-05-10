import { Hono } from "hono";
import * as v from "valibot";
import { matchingUsers } from "../state";
import { json } from "../validator";

const route = new Hono().post(
  "/",
  json(
    v.object({
      user: v.string(),
    }),
  ),
  async (c) => {
    const json = c.req.valid("json");
    const id = crypto.randomUUID();

    matchingUsers.update((users) => {
      users.push(id);
      return users;
    });
    return c.json({ id });
  },
);
export default route;

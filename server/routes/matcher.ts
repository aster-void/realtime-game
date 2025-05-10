import { Uuid } from "@repo/share/types";
import { Hono } from "hono";
import * as v from "valibot";
import { matchingUsers } from "../state";
import { json } from "../validator";

const route = new Hono().post(
  "/",
  json(
    v.object({
      id: Uuid,
    }),
  ),
  async (c) => {
    const json = c.req.valid("json");
    const id = json.id;

    matchingUsers.update((users) => {
      users.push(id);
      return users;
    });
    return c.status(202);
  },
);
export default route;

import { Uuid } from "@repo/share/types";
import { Hono } from "hono";
import { param } from "../lib/validator.ts";
import { matcher } from "../model/matcher.ts";

const route = new Hono()
  .put(
    "/:id",
    param({
      id: Uuid,
    }),
    async (c) => {
      const param = c.req.valid("param");
      const id = param.id;

      matcher.register(id);
      return c.status(202);
    },
  )
  .delete(
    "/:id",
    param({
      id: Uuid,
    }),
    async (c) => {
      const param = c.req.valid("param");
      const id = param.id;

      matcher.unregister(id);
      return c.status(202);
    },
  );
export default route;

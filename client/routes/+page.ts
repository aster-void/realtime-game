import { error } from "@sveltejs/kit";
import { createClient } from "~/api/client.ts";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch }) => {
  const client = createClient({ fetch });
  const rooms = await client.rooms.$get().then((it) => it.json()); // TODO: handle not found case somehow

  return {
    rooms: await rooms,
  };
};

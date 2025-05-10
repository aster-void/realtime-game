import { createClient } from "~/api/client.ts";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch }) => {
  const client = createClient({ fetch });
  const rooms = client.rooms.$get().then((res) => res.json());
  return {
    rooms: await rooms,
  };
};

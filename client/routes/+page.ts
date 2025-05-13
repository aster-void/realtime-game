import { error } from "@sveltejs/kit";
import { createClient } from "~/api/client.ts";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch }) => {
  const client = createClient({ fetch });
  const rooms = await client.rooms
    .$get()
    .then((resp) => {
      if (!resp.ok) {
        error(resp.status, `HTTP error! status: ${resp.status}`);
      }
      return resp.json();
    })
    .catch((err) => {
      console.error("Failed to load rooms:", err);
      error(500, "Failed to load rooms");
    });
  return {
    rooms,
  };
};

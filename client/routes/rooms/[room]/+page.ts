import { createClient } from "~/api/client.js";

import { error } from "@sveltejs/kit";

export async function load({ fetch, params }) {
  const roomId = params.room;

  const client = createClient({ fetch });
  const room = client.rooms[":id"]
    .$get({
      param: {
        id: roomId,
      },
    })
    .then((resp) => {
      if (!resp.ok) {
        error(resp.status, `HTTP error! status: ${resp.status}`);
      }
      return resp.json();
    })
    .catch((err) => {
      console.error("Failed to load room:", err);
      error(500, "Failed to load room");
    });

  return {
    room: await room,
  };
}

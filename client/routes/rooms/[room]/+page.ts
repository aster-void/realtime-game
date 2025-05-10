import type { Room } from "@repo/share/types";
import { createClient } from "~/api/client.js";

export async function load({ fetch, params }) {
  const roomId = params.room;

  const client = createClient({ fetch });
  const room = (async () => {
    const res = await client.rooms[":id"].$get({
      param: {
        id: roomId,
      },
    });
    const json: Room = await res.json();
    return json;
  })();

  return {
    room: await room,
  };
}

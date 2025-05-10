<script lang="ts">
import type { Hand, Room, Uuid } from "share/types";
type Props = {
  state: {
    status: "game";
    room: Room;
    players: {
      id: Uuid;
      name: string;
      hand: Hand | null;
    }[];
  };
};
const { state }: Props = $props();
const room = $derived(state.room);
const players = $derived(state.players);
</script>

<h1>Game</h1>
<p>Room: {room.name}</p>
<ul>
    {#each players as player}
        <li>{player.name}</li>
    {/each}
</ul>
<ul>
    {#each players as player}
        <li>{player.hand}</li>
    {/each}
</ul>

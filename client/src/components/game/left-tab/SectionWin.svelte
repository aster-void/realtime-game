
<script lang="ts">
import type { RoomController } from "~/controller/room.controller.svelte";

type Props = {
  room: RoomController;
};
let { room }: Props = $props();
</script>
{#if room.state?.status.type === "end"}
<div class="bg-accent text-accent-content p-4 rounded-lg shadow-lg">
    <p class="text-3xl font-bold">👑 {room.state?.status.winner.name}</p>
    <p class="text-lg">Congratulations to the winner!</p>
  </div>
{/if}
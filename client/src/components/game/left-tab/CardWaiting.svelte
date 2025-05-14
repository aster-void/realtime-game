<script lang="ts">
import type { Snippet } from "svelte";
import type { RoomController } from "~/controller/room.controller.svelte";

type Props = {
  room: RoomController;
  children: Snippet;
};
let { room, children }: Props = $props();
const canStart = $derived(room.players.length >= 2 && !room.processing);
const missingPlayers = $derived(2 - room.players.length);
</script>

<div class="card bg-base-100 shadow-xl">
  <div class="card-body">
    {@render children()}
    <div class="card-actions justify-end mt-auto">
      {#if room.state?.status.type === "waitroom"}
        {@render StartButton('Start Game', 'btn btn-primary w-full')}
      {:else}
        {@render StartButton('Play Again', 'btn btn-primary btn-outline w-full')}
      {/if}
    </div>
  </div>
</div>

{#snippet StartButton(text: string, class_: string)}
<button
    class={class_}
    disabled={!canStart}
    onclick={() => room.startGame()}
  >
    {canStart ? text : `Wait for ${missingPlayers} more player${missingPlayers === 1 ? '' : 's'}`}
  </button>
{/snippet}
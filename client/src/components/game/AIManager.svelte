<script lang="ts">
import type { Player } from "@repo/share/types";
import type { RoomController } from "../../controller/room.controller.svelte.ts";

type Props = {
  aiPlayers: Player[];
  room: RoomController;
};
const { aiPlayers, room }: Props = $props();
</script>

<div class="card bg-base-100 shadow-xl mb-6">
    <div class="card-body">
      <h2 class="card-title">AI Players</h2>
      <div class="space-y-4">
        <form onsubmit={(e) => {
          e.preventDefault();
          room.addAI();
        }} class="flex items-center gap-2">
          <input
            type="text"
            bind:value={room.aiName}
            placeholder="AI Player Name"
            class="input input-bordered"
          />
          <button 
            class="btn btn-primary"
            type="submit"
            disabled={room.processing}
          >
            Add AI
          </button>
        </form>
        
        {#if aiPlayers.length > 0}
          <div class="space-y-2">
            <h3 class="font-medium">AI Players in Room</h3>
            <div class="space-y-2">
              {#each aiPlayers as ai}
                <div class="flex justify-between items-center p-2 bg-base-200 rounded">
                  <div class="flex items-center gap-2">
                    <span>🤖</span>
                    <span>{ai.name}</span>
                  </div>
                  <button 
                    class="btn btn-sm btn-error"
                    onclick={() => room.removeAI(ai.id)}
                    disabled={room.processing}
                  >
                    Remove
                  </button>
                </div>
              {/each}
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
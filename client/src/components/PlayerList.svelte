<script lang="ts">
import type { RoomController } from "~/controller/room.controller.svelte.ts";

type Props = {
  loading: boolean;
  room: RoomController;
  onStartGame: () => void;
};
const { room, onStartGame, loading }: Props = $props();
</script>

<div class="card bg-base-100 shadow-xl h-full">
  <div class="card-body">
    <h2 class="card-title">
      Players 
      <div class="badge badge-primary">
        {room.players.length}
      </div>
    </h2>
    
    <div class="overflow-y-auto max-h-96">
      {#if room.players.length > 0}
        <ul class="menu bg-base-200 rounded-box">
          {#each room.players as player}
            <li>
              <div class="flex justify-between items-center">
                <div class="flex items-center gap-3">
                  <div>
                    <div class="font-bold">{player.name}</div>
                    <div class="text-xs opacity-50">ID: {player.id.slice(0, 6)}</div>
                  </div>
                </div>  
              </div>
            </li>
          {/each}
        </ul>
      {:else}
        <div class="text-center py-8">
          <p class="text-gray-500">No players yet</p>
        </div>
      {/if}
    </div>

    {#if room.state?.status.type === "waitroom"}
      <div class="card-actions justify-end mt-4">
        <button
          class="btn btn-primary w-full"
          disabled={room.players.length < 2 || loading}
          onclick={onStartGame}
        >
          { room.players.length < 2 
            ? `Need ${2 - room.players.length} more to start` 
            : 'Start Game'}
        </button>
      </div>
    {/if}
  </div>
</div>

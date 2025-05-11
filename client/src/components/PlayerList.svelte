<script lang="ts">
import type { Room } from "@repo/share/types";

type Props = {
  loading: boolean;
  room: Room;
  onStartGame: () => void;
};
const { room, onStartGame, loading }: Props = $props();
</script>

<div class="card bg-base-100 shadow-xl h-full">
  <div class="card-body">
    <h2 class="card-title">
      Players 
      <div class="badge badge-primary">
        {room.status.players.length}
      </div>
    </h2>
    
    <div class="overflow-y-auto max-h-96">
      {#if room.status.players.length > 0}
        <ul class="menu bg-base-200 rounded-box">
          {#each room.status.players as player}
            <li>
              <div class="flex justify-between items-center">
                <div class="flex items-center gap-3">
                  <div class="avatar placeholder">
                    <div class="bg-neutral text-neutral-content rounded-full w-8">
                      <span class="text-xs">{player.name}</span>
                    </div>
                  </div>
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

    {#if room.status.type === "waitroom"}
      <div class="card-actions justify-end mt-4">
        <button
          class="btn btn-primary w-full"
          disabled={room.status.players.length < 2 || loading}
          onclick={onStartGame}
        >
          { room.status.players.length < 2 
            ? `Need ${2 - room.status.players.length} more to start` 
            : 'Start Game'}
        </button>
      </div>
    {/if}
  </div>
</div>

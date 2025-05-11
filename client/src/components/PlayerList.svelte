<script lang="ts">
  import type { Player } from "@/types";

  export let players: Player[] = [];
  export let status: string = 'waiting';
  export let onStartGame: () => void = () => {};
</script>

<div class="card bg-base-100 shadow-xl h-full">
  <div class="card-body">
    <h2 class="card-title">
      Players 
      <div class="badge badge-primary">
        {players.length}
      </div>
    </h2>
    
    <div class="overflow-y-auto max-h-96">
      {#if players.length > 0}
        <ul class="menu bg-base-200 rounded-box">
          {#each players as player, i}
            <li>
              <div class="flex justify-between items-center">
                <div class="flex items-center gap-3">
                  <div class="avatar placeholder">
                    <div class="bg-neutral text-neutral-content rounded-full w-8">
                      <span class="text-xs">{player.name[0].toUpperCase()}</span>
                    </div>
                  </div>
                  <div>
                    <div class="font-bold">{player.name}</div>
                    <div class="text-xs opacity-50">ID: {player.id.slice(0, 6)}</div>
                  </div>
                </div>
                {i === 0 && <div class="badge badge-primary">Host</div>}
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

    {#if status === "waitroom"}
      <div class="card-actions justify-end mt-4">
        <button
          class="btn btn-primary w-full"
          disabled={players.length < 2}
          on:click={onStartGame}
        >
          {players.length < 2 
            ? `Need ${2 - players.length} more to start` 
            : 'Start Game'}
        </button>
      </div>
    {/if}
  </div>
</div>

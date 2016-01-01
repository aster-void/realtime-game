<script lang="ts">
import { goto } from "$app/navigation";
import { RoomController } from "~/controller/room.controller.svelte.ts";

// Components
import RoomHeader from "~/components/RoomHeader.svelte";

type Props = {
  roomController: RoomController;
};

const { roomController }: Props = $props();
const game = $derived(roomController.state);

let playerName = $state("");
$effect(() => {
  roomController.updateUsername(playerName);
});

function handleLeaveGame() {
  // TODO: Implement leave game logic
  goto("/");
}
</script>

{#if game}
  <!-- Main Content -->
  <div class="container mx-auto p-4">
    <RoomHeader
      room={game}
      bind:playerName
    />

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left Column - Players List -->
      <div class="lg:col-span-1">
        <div class="card bg-base-100 shadow-xl h-full">
          <div class="card-body">
            <h2 class="card-title">Players</h2>
            <div class="space-y-2">
              {#each game.status.players as player}
                <div class="flex items-center gap-3 p-2 rounded-lg {player.id === roomController.userId ? 'bg-primary/10' : ''}">
                  <div class="avatar placeholder">
                    <div class="bg-neutral text-neutral-content rounded-full w-8">
                      <span class="text-xs">{player.name}</span>
                    </div>
                  </div>
                  <div class="flex-1">
                    <div class="font-medium">{player.name}</div>
                    <div class="text-xs opacity-70">{player.id?.slice(0, 6)}</div>
                  </div>
                  <div class="badge badge-primary">{ player.action || "Waiting"}</div>
                  <div class="badge badge-error">{player.dead ? "Dead" : ""}</div>
                </div>
              {/each}
            </div>
            
            <div class="mt-4">
              <button 
                class="btn btn-outline btn-error w-full"
                onclick={handleLeaveGame}
              >
                Leave Game
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="lg:col-span-2">
        <div class="card bg-base-100 shadow-xl h-full">
          <div class="card-body">
            <h2 class="card-title">Action</h2>
            <div class="space-y-2">
 {#each ["グー", "チョキ", "パー"] as const as hand}
  <button
    class="btn btn-outline"
    onclick={() => roomController.action(hand)}
  >
    {hand}
  </button>
 {/each}             
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}


<style>
  .game-board {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }
  
  button:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
  
  .invisible {
    visibility: hidden;
  }
</style>

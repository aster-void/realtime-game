<script lang="ts">
import { useGlobal } from "~/controller/global.svelte";
import type { RoomController } from "~/controller/room.controller.svelte.ts";

type Props = {
  room: RoomController;
};
const { room }: Props = $props();

const global = useGlobal();
const game = $derived(room.state?.status);
</script>

<div class="card bg-base-100 shadow-xl h-full">
  <div class="card-body">
    <h2 class="card-title">
      Players 
      <div class="badge badge-primary">
        {room.players.length}
      </div>
    </h2>
    
    <div class="overflow-y-auto max-h-96 rounded-xl">
      {#if room.players.length > 0}
        <ul class="bg-base-200">
          {#each room.players as player}
          {@const isWinner = game?.type === "end" && game?.winner.id === player.id}
          {@const isMe = player.id === global.userId}
            <li class="flex flex-row items-center gap-2 border-b border-gray-300 py-2 px-4 {isWinner ? "bg-green-100" : isMe ? "bg-blue-100" : player.dead ? "bg-red-100" : ""}">
                <span class="">{ (isWinner ? "👑" : player.dead ? "💀" : player.isAI ? "🤖" : "👤")}</span>
                <span class="font-bold">{player.name}</span>
                <span class="text-xs opacity-50 grow">
                  ID: {player.id.slice(0, 6)}
                </span>
                {#if player.dead}
                  <span class="text-xs text-red-500">Dead</span>
                {/if}
                <span class="text-xs">
                  {player.action ?? "no action"}
                </span>
            </li>
          {/each}
        </ul>
      {:else}
        <div class="text-center py-8">
          <p class="text-gray-500">No players yet</p>
        </div>
      {/if}
    </div>
  </div>
</div>

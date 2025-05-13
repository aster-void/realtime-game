<script lang="ts">
import type { Player } from "@repo/share/types";
import { RoomController } from "~/controller/room.controller.svelte.ts";

import AIList from "~/components/game/AIManager.svelte";
import Actions from "~/components/game/Actions.svelte";
import PlayerList from "~/components/game/PlayerList.svelte";
// Components
import RoomHeader from "~/components/game/RoomHeader.svelte";

type Props = {
  room: RoomController;
};

let { room }: Props = $props();

// AI Player Management
const aiPlayers = $derived(
  room.players.filter((p): p is Player & { isAI: true } => p.isAI === true),
);
</script>
{#if room}
<div class="min-h-screen bg-base-200">
  <main class="container mx-auto p-4">
    <RoomHeader
      room={room}
      onPlayerNameChange={(name) => room.updateUsername(name)}
    />

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left Column - Players List -->
      <div>
        <PlayerList
          room={room}
        />
      </div>

      <!-- Middle Column - Game Controls -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">

    {#if room.state?.status.type === "waitroom"}
    <div class="card-actions justify-end mt-4">
      <button
        class="btn btn-primary w-full"
        disabled={room.players.length < 2 || room.processing}
        onclick={() => room.startGame()}
      >
        { room.players.length < 2 
          ? `Need ${2 - room.players.length} more to start` 
          : 'Start Game'}
      </button>
    </div>
  {/if}

        {#if room.state?.status.type === "playing"}
          <Actions
            onaction={(hand) => room.action(hand)}
            disabled={room.processing || room.me?.action != null || room.me?.dead}
          />
        {/if}
        {#if room.state?.status.type === "end"}
          <div class="text-center py-8">
            <p class="text-2xl font-bold">👑 {room.state?.status.winner.name}</p>
          </div>
          <div class="card-actions justify-end mt-4">
            <button
              class="btn btn-primary btn-outline w-full"
              onclick={() => room.startGame()}
            >
              Play Again
            </button>
          </div>
        {/if}
        </div>
      </div>
      <!-- Right Column - AI Player Controls -->
      <div>
        <AIList aiPlayers={aiPlayers} room={room} />
      </div>
    </div>
  </main>
</div>

{/if}

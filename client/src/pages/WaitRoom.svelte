<script lang="ts">
import type { Player } from "@repo/share/types";
import { RoomController } from "~/controller/room.controller.svelte.ts";

// Components
import RoomHeader from "~/components/RoomHeader.svelte";
import AIList from "~/components/waitroom/AIManager.svelte";
import PlayerManager from "~/components/waitroom/PlayerManager.svelte";

type Props = {
  roomController: RoomController;
};

let { roomController }: Props = $props();
const room = $derived(roomController.state);
const status = $derived(room?.status);

// AI Player Management
const aiPlayers = $derived(
  status?.type === "waitroom"
    ? status.players.filter(
        (p): p is Player & { isAI: true } => p.isAI === true,
      )
    : [],
);
</script>
{#if status?.type === "waitroom" && room}
<div class="min-h-screen bg-base-200">
  <main class="container mx-auto p-4">
    <RoomHeader
      room={room}
      onPlayerNameChange={(name) => roomController.updateUsername(name)}
    />

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left Column - Players List -->
      <div class="lg:col-span-1">
        <PlayerManager 
          room={room}
          loading={roomController.processing}
          onStartGame={() => roomController.startGame()}
        />
      </div>

      <!-- Middle Column - Game Controls -->
      <div class="lg:col-span-2">
        <AIList aiPlayers={aiPlayers} room={roomController} />
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h2 class="card-title">Game Information</h2>
            <div class="alert alert-info">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>Waiting for more players to join...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</div>

{/if}

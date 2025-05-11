<script lang="ts">
  import { onMount } from 'svelte';
  import { RoomController } from "~/controller/room.controller.svelte.ts";
  import { goto } from "$app/navigation";
  import type { RoomState } from "@/types";
  
  // Components
  import RoomHeader from "./RoomHeader.svelte";
  import PlayerList from "./PlayerList.svelte";

  const { data } = $props();
  const roomState = new RoomController(data.room);
  
  // Create a reactive store for the room state
  let currentRoomState: RoomState = $state({
    room: data.room,
    status: data.room?.status || 'waiting'
  });
  
  // Subscribe to room state changes
  onMount(() => {
    const unsubscribe = roomState.subscribe((state) => {
      currentRoomState = state;
    });
    
    return () => unsubscribe();
  });

  function copyRoomLink() {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    // TODO: Show toast notification
  }

  function handleNameChange(name: string) {
    roomState.updateUsername(name);
  }

  function startGame() {
    // TODO: Implement game start logic
    console.log("Starting game...");
  }
</script>

<div class="min-h-screen bg-base-200">
  <!-- Navigation -->
  <div class="navbar bg-base-100 shadow-lg px-4">
    <div class="flex-1">
      <button type="button" class="btn btn-ghost text-xl" on:click={() => goto('/')}>
        <span class="text-primary">Realtime</span>
        <span class="text-accent">Game</span>
      </button>
    </div>
    <div class="flex-none gap-2">
      <div class="dropdown dropdown-end">
        <div tabindex="0" role="button" class="btn btn-ghost">
          <div class="w-10 rounded-full">
            <div class="avatar placeholder">
              <div class="bg-neutral text-neutral-content rounded-full w-8">
                <span class="text-xs">
                  {$roomState.state?.room?.players?.[0]?.name?.[0]?.toUpperCase() || 'U'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Main Content -->
  <div class="container mx-auto p-4">
    <RoomHeader 
      roomName={currentRoomState.room?.name}
      roomId={currentRoomState.room?.id}
      status={currentRoomState.status}
      onCopyLink={copyRoomLink}
      onNameChange={handleNameChange}
    />

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left Column - Players List -->
      <div class="lg:col-span-1">
        <PlayerList 
          players={currentRoomState.room?.players || []} 
          status={currentRoomState.status}
          onStartGame={startGame}
        />
      </div>

      <!-- Middle Column - Game Board/Area (Placeholder) -->
      <div class="lg:col-span-2">
        <div class="card bg-base-100 shadow-xl h-full">
          <div class="card-body">
            <h2 class="card-title">Game Area</h2>
            <p>Game content will appear here</p>
            {#if currentRoomState.status === 'waiting'}
              <div class="alert alert-info mt-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>Waiting for more players to join...</span>
              </div>
            {/if}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  /* Removed unused styles as they've been moved to their respective components */
</style>

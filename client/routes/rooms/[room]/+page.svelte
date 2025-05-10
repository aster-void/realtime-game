<script lang="ts">
import { useRoomState } from "~/controller/room.controller.ts";
const { data } = $props();

const _state = useRoomState(data.room);
const state = $derived($_state);
</script>

<div class="container">
  <!-- Room Header -->
  <header class="room-header">
    <h1>{state.room?.name || "Loading..."}</h1>
    <div class="status-indicator">
      <span class="status-dot {state.status}"></span>
      <span class="status-text">{state.status}</span>
    </div>
  </header>

  <!-- Players List -->
  <section class="players-list">
    <h2>Players ({state.room?.players?.length || 0})</h2>
    <ul>
      {#if state.room?.players}
        {#each state.room.players as player}
          <li class="player-item">
            <div class="player-avatar">
              <img src="avatar-placeholder.png" alt="{player.name}'s avatar" />
            </div>
            <div class="player-info">
              <h3>{player.name}</h3>
              <p class="player-id">#{player.id}</p>
            </div>
          </li>
        {/each}
      {:else}
        <li class="loading">Loading players...</li>
      {/if}
    </ul>
  </section>

  <!-- Room Actions -->
  <section class="room-actions">
    {#if state.status === 'waitroom'}
      <button class="start-game" disabled={state.room?.players?.length < 2}>
        Start Game
      </button>
    {/if}
  </section>
</div>

<style>
  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
    font-family: system-ui, -apple-system, sans-serif;
  }

  .room-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid #eee;
  }

  .status-indicator {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .status-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    display: inline-block;
  }

  .status-dot.waitroom { background-color: #4CAF50; }
  .status-dot.matching { background-color: #2196F3; }
  .status-dot.game { background-color: #F44336; }

  .players-list {
    margin-bottom: 2rem;
  }

  .players-list ul {
    list-style: none;
    padding: 0;
  }

  .player-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    border-radius: 8px;
    background-color: #f5f5f5;
    margin-bottom: 0.5rem;
  }

  .player-avatar img {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    object-fit: cover;
  }

  .player-info h3 {
    margin: 0;
    font-size: 1.1rem;
  }

  .player-id {
    color: #666;
    font-size: 0.9rem;
  }

  .room-actions {
    display: flex;
    gap: 1rem;
  }

  button {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 6px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .start-game {
    background-color: #4CAF50;
    color: white;
  }

  .start-game:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  .loading {
    text-align: center;
    color: #666;
    padding: 1rem;
  }

  @media (max-width: 640px) {
    .container {
      padding: 1rem;
    }

    .room-header {
      flex-direction: column;
      gap: 1rem;
      text-align: center;
    }

    .player-item {
      flex-direction: column;
      text-align: center;
    }

    .player-avatar {
      margin-bottom: 0.5rem;
    }
  }
</style>
<script lang="ts">
import type { Room, Uuid } from "@repo/share/types";
import { createClient } from "~/api/client.ts";
import { LobbyController } from "~/states/lobby.controller.svelte";

type Props = {
  rooms: Room[] | null;
};
const { rooms }: Props = $props();

const lobby = new LobbyController({ fetch });
</script>

<div class="lobby">
    <h1>Lobby</h1>

    <div class="rooms-list">
        <h2>Available Rooms</h2>
        {#if rooms === null}
            <p>Loading rooms...</p>
        {:else if rooms.length === 0}
            <p>No rooms available. Create one!</p>
        {:else}
            <ul>
                {#each rooms as room}
                    <li>
                        <button onclick={() => lobby.joinRoom(room.id)}>
                            Join {room.name}
                        </button>
                        <p>Players: {room.players.length}</p>
                    </li>
                {/each}
            </ul>
        {/if}
    </div>

    <div class="create-room">
        <button onclick={() => lobby.requestRandomMatch()}>Random Match</button>
        <button onclick={() => lobby.joinRoom('new')}>Create New Room</button>
    </div>
</div>

<style>
    .lobby {
        max-width: 800px;
        margin: 0 auto;
        padding: 2rem;
    }

    .rooms-list {
        margin: 2rem 0;
    }

    .rooms-list ul {
        list-style: none;
        padding: 0;
    }

    .rooms-list li {
        background: #f5f5f5;
        border-radius: 8px;
        padding: 1rem;
        margin-bottom: 1rem;
    }

    button {
        background: #4CAF50;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        cursor: pointer;
        transition: background 0.2s;
    }

    button:hover {
        background: #45a049;
    }
</style>
<script lang="ts">
import type { Room } from "@repo/share/types";
import { LobbyController } from "~/controller/lobby.controller.svelte";

type Props = {
  defaultRooms: Room[];
};
const { defaultRooms }: Props = $props();

const lobby = new LobbyController({ fetch, defaultRooms });
</script>

<div class="lobby">
    <h1>Lobby</h1>

    <div class="rooms-list">
        <h2>Available Rooms</h2>
            <ul>
                {#each lobby.rooms as room}
                    <li>
                        <button onclick={() => lobby.joinRoom(room.id)}>
                            Join {room.name}
                        </button>
                        {#if room.status.type !== "end"}
                            <p>Players: {room.status.players.length}</p>
                        {/if}
                    </li>
                {:else}
                    <li>No rooms available</li>
                {/each}
            </ul>
    </div>

    <div class="create-room">
        <button onclick={() => lobby.requestRandomMatch()}>Random Match</button>
        <form onsubmit={(e) => {
            e.preventDefault();
            const name = (e.target as HTMLFormElement).elements.namedItem("name") as HTMLInputElement;
            lobby.createRoom(name.value);
        }}>
            <input type="text" name="name" required />
            <button type="submit">Create</button>
        </form>
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
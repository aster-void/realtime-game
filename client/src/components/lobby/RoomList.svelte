<script lang="ts">
import type { Player, Room } from "@repo/share/types";
import { useGlobal } from "~/controller/global.svelte";
import { LobbyController } from "~/controller/lobby.controller.svelte";
type Props = {
  rooms: Room[];
  lobby: LobbyController;
};
let { rooms, lobby }: Props = $props();
let roomName = $state("");

const global = useGlobal();

function humans(room: Room) {
  return room.status.players.filter((p): p is Player => p.isAI === false);
}

function ais(room: Room) {
  return room.status.players.filter((p): p is Player => p.isAI === true);
}
</script>

<div class="w-full max-w-2xl mx-auto mt-4">
    <h2 class="text-2xl font-bold text-center mb-4 text-primary">Available Rooms</h2>
    
    <ul class="space-y-2 bg-base-100 shadow-sm p-4">
        {#each rooms as room}
        {@const humansCount = humans(room).length}
        {@const aisCount = ais(room).length}
            <li class="card card-compact card-bordered bg-base-100 hover:bg-base-200 transition-colors">
                <div class="card-body p-3 flex flex-row items-center justify-between">
                    <h3 class="font-medium grow">{room.name}</h3>
                    <div class="flex space-x-2">
                        <span class="badge text-sm">
                            {humansCount} {humansCount === 1 ? 'player' : 'players'}
                        </span>
                        <span class="badge text-sm">
                            {aisCount} {aisCount === 1 ? 'AI' : 'AIs'}
                        </span>
                        {#if room.status.type === "waitroom"}
                            <span class="badge badge-primary">Waiting</span>
                        {:else if room.status.type === "playing"}
                            <span class="badge badge-success">Playing</span>
                        {:else if room.status.type === "end"}
                            <span class="badge badge-primary">Ended</span>
                        {/if}
                    </div>
                    <button 
                        class="btn btn-sm btn-primary"
                        disabled={global.username === ""}
                        onclick={() => lobby.joinRoom(room.id)}
                    >
                        Join
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                        </svg>
                    </button>
                </div>
            </li>
        {:else}
            <li class="alert alert-info alert-outline">
                <img src="/icons/info.svg" alt="Info" class="w-5 h-5">
                <span class="text-sm">No rooms available. Create one to get started!</span>
            </li>
        {/each}

        <form class="flex items-center gap-2 flex-grow" onsubmit={(e) => {
            e.preventDefault();
            lobby.createRoom(roomName); 
        }}>
            <input type="text" name="name" required class="input input-bordered grow" placeholder="Enter room name" bind:value={roomName}/>
            <button type="submit" class="btn btn-primary" disabled={roomName.trim() === "" || global.username === ""}>Create</button>
        </form>
    </ul>
</div>
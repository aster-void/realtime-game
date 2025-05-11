<script lang="ts">
import type { Room } from "@repo/share/types";
import { useGlobal } from "~/controller/global.svelte";
import { LobbyController } from "~/controller/lobby.controller.svelte";
type Props = {
  rooms: Room[];
  lobby: LobbyController;
};
let { rooms, lobby }: Props = $props();
let roomName = $state("");

const global = useGlobal();
</script>

<div class="w-full max-w-2xl mx-auto mt-4">
    <h2 class="text-2xl font-bold text-center mb-4 text-primary">Available Rooms</h2>
    
    <div class="space-y-2 bg-base-100 shadow-sm p-4">
        {#each rooms as room}
            <div class="card card-compact card-bordered bg-base-100 hover:bg-base-200 transition-colors">
                <div class="card-body p-3 flex flex-row items-center justify-between">
                    <div class="flex items-center space-x-3">
                        <h3 class="font-medium">{room.name}</h3>
                        {#if room.status.type !== "end"}
                            <span class="badge badge-ghost">
                                {room.status.players.length} {room.status.players.length === 1 ? 'player' : 'players'}
                            </span>
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
            </div>
        {:else}
            <div class="alert alert-info alert-outline">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-info flex-shrink-0 w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span class="text-sm">No rooms available. Create one to get started!</span>
            </div>
        {/each}

        <form class="flex items-center gap-2 flex-grow" onsubmit={(e) => {
            e.preventDefault();
            lobby.createRoom(roomName); 
        }}>
            <input type="text" name="name" required class="input input-bordered" placeholder="Enter room name" bind:value={roomName}/>
            <button type="submit" class="btn btn-primary" disabled={roomName.trim() === "" || global.username === ""}>Create</button>
        </form>
    </div>
</div>
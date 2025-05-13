<script lang="ts">
import type { Room } from "@repo/share/types";
import RoomList from "~/components/lobby/RoomList.svelte";
import { useGlobal } from "~/controller/global.svelte.ts";
import { LobbyController } from "~/controller/lobby.controller.svelte.ts";
type Props = {
  defaultRooms: Room[];
};
const { defaultRooms }: Props = $props();

const global = useGlobal();
let roomName = $state("");

const lobby = new LobbyController({ fetch, defaultRooms });
</script>
<main class="container mx-auto p-4 grid grid-cols-1 gap-8">
    <h1 class="text-3xl font-bold">Lobby</h1>
    <input bind:value={global.username} class="input input-bordered" placeholder="Enter your name"/>

    <RoomList rooms={lobby.rooms} lobby={lobby}/>

    <div class="flex items-center gap-2 mt-4">
        <button class="btn btn-secondary" disabled={global.username === ""} onclick={() => lobby.requestRandomMatch()}>Random Match</button>
    </div>
</main>
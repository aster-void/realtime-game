<script lang="ts">
import { RoomController } from "~/controller/room.controller.svelte.ts";
import Game from "~/pages/Game.svelte";
import GameEnd from "~/pages/GameEnd.svelte";
import WaitRoom from "~/pages/WaitRoom.svelte";

const { data } = $props();
const roomController = new RoomController(data.room);
$inspect(roomController.state);
</script>

{#if roomController.state?.status.type === 'waitroom'}
  <WaitRoom room={roomController} />
{:else if roomController.state?.status.type === 'playing'}
  <Game room={roomController} />
{:else if roomController.state?.status.type === 'end'}
  <GameEnd room={roomController} />
{:else}
  <div>Game not found</div>
{/if}

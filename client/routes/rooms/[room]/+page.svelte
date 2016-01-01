<script lang="ts">
import { RoomController } from "~/controller/room.controller.svelte.ts";
import Game from "~/pages/Game.svelte";
import WaitRoom from "~/pages/WaitRoom.svelte";

const { data } = $props();
const roomController = new RoomController(data.room);
$inspect(roomController.state);
</script>

{#if roomController.state?.status.type === 'waitroom'}
  <WaitRoom roomController={roomController} />
{:else}
  <Game roomController={roomController} />
{/if}

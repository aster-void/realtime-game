<script lang="ts">
import { RoomController } from "~/controller/room.controller.svelte.ts";
import Game from "~/pages/Game.svelte";

const { data } = $props();
const roomController = new RoomController(data.room);
</script>

<Game room={roomController} />


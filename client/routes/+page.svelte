<script lang="ts">
import Lobby from "~/pages/Lobby.svelte";
import type { PageProps } from "./$types";

const { data }: PageProps = $props();
</script>

<Lobby defaultRooms={data.rooms}/>

<script lang="ts">
import Lobby from "~/components/Lobby.svelte";
import type { PageProps } from "./$types";

const { data }: PageProps = $props();
</script>

<Lobby defaultRooms={data.rooms} />

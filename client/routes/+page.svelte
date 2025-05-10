<script lang="ts">
import Game from "../src/components/Game.svelte";
import Lobby from "../src/components/Lobby.svelte";
import { useState } from "../src/global.svelte.ts";
const globalState = useState();
</script>

{#if globalState.status === "game"}
    <Game state={globalState} />
    {:else if globalState.status === "lobby"}
        <Lobby state={globalState} />
    {:else if globalState.status === "matching"}
    {:else if globalState.status === "waitroom"}
    {:else if globalState.status === "end"}
    {:else}
        <p>Unknown state: {globalState satisfies never}</p>
    {/if}
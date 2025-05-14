<script lang="ts">
import type { Player } from "@repo/share/types";
import { RoomController } from "~/controller/room.controller.svelte.ts";

import AIList from "~/components/game/AIManager.svelte";
import Actions from "~/components/game/Actions.svelte";
import PlayerList from "~/components/game/PlayerList.svelte";
// Components
import RoomHeader from "~/components/game/RoomHeader.svelte";
import Waiting from "~/components/game/left-tab/CardWaiting.svelte";
import TabWin from "~/components/game/left-tab/SectionWin.svelte";

type Props = {
  room: RoomController;
};

let { room }: Props = $props();

// AI Player Management
const aiPlayers = $derived(
  room.players.filter((p): p is Player & { isAI: true } => p.isAI === true),
);
const winnerId = $derived(
  room.state?.status.type === "end" ? room.state?.status.winner.id : undefined,
);
</script>

{#if room}
<div class="min-h-screen bg-base-200">
  <main class="container mx-auto p-4">
    <RoomHeader
      room={room}
      onPlayerNameChange={(name) => room.updateUsername(name)}
    />

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Left -->
      <div>
        <!-- Left Top -->
        <div>
          <PlayerList
            room={room}
            showAIs={room.state?.status.type === "playing"}
          />
        </div>
        <!-- Left Bottom -->
        {#if room.state?.status.type !== "playing"}
          <AIList {aiPlayers} {room} {winnerId}/>
        {/if}
      </div>

      <!-- Right -->
      {#if room.state?.status.type === "playing"}
        <Actions
          onaction={(hand) => room.action(hand)}
          disabled={room.processing || room.me?.action != null || room.me?.dead}
        />
      {:else}
        <Waiting {room}>
          {#if room.state?.status.type === "end"}
            <TabWin {room} />  
          {/if}
        </Waiting>
      {/if}
    </div>
  </main>
</div>

{/if}

<script lang="ts">
import type { Room } from "@repo/share/types";

type Props = {
  room: Room;
  playerName: string;
};
let { room, playerName = $bindable() }: Props = $props();
</script>

<div class="card bg-base-100 shadow-xl mb-6">
  <div class="card-body">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div class="flex-1">
        <h1 class="card-title text-2xl md:text-3xl font-bold">
          {room.name || "Loading..."}
          <div class="badge badge-lg ml-2">
            {room.status.type}
          </div>
        </h1>
        <p class="text-sm opacity-70 mt-1">
          Room ID: {room.id}
        </p>
      </div>
      
      <div class="w-full md:w-64">
        <div class="form-control">
            <span class="label-text">Your Name</span>
            <input 
              type="text" 
              bind:value={playerName}
              class="input input-bordered w-full" 
              placeholder="Enter your name"
            />
        </div>
      </div>
    </div>
  </div>
</div>

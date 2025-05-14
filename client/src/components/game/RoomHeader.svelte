<script lang="ts">
import { untrack } from "svelte";
import { useGlobal } from "~/controller/global.svelte";
import type { RoomController } from "~/controller/room.controller.svelte";

type Props = {
  room: RoomController;
  onPlayerNameChange: (name: string) => void;
};
let { room, onPlayerNameChange }: Props = $props();
const global = useGlobal();
$effect(() => {
  global.username;
  untrack(() => {
    onPlayerNameChange(global.username);
  });
});
</script>

<div class="card bg-base-100 shadow-xl mb-6">
  <div class="card-body">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div class="flex-1">
        <h1 class="card-title text-2xl md:text-3xl font-bold">
          {room.state?.name}
          <div class="badge badge-lg ml-2">
            {(() => {
              switch (room.state?.status.type) {
                case "waitroom":
                  return "Waiting";
                case "playing":
                  return "Playing";
                case "end":
                  return "Ended";
                default:
                  return "Unknown";
              }
            })()}
          </div>
        </h1>
        <p class="text-sm opacity-70 mt-1">
          Room ID: {room.state?.id}
        </p>
      </div>
      
      <div class="w-full md:w-64">
        <div class="form-control">
            <span class="label-text">Your Name</span>
            <input 
              type="text" 
              bind:value={global.username}
              class="input input-bordered w-full" 
              placeholder="Enter your name"
            />
        </div>
      </div>
    </div>
  </div>
</div>

<script lang="ts">
import { useGlobal } from "~/controller/global.svelte";

const global = useGlobal();
</script>

<nav class="bg-base-100 dark:bg-base-200 shadow-sm px-4 py-2 md:px-6 md:py-4">
  <div class="container mx-auto flex items-center justify-between">
    <div class="logo">
      <a href="/" class="text-xl font-bold flex items-center gap-2" >
        <span class="text-primary">Realtime</span>
        <span class="text-accent">Game</span>
      </a>
    </div>
    <div class="nav-links gap-4">
      <input type="text" bind:value={global.username} class="input input-bordered" placeholder="Enter your name"/>
    </div>
  </div>
</nav>

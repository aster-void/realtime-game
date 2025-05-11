<script lang="ts">
  export let roomName: string = '';
  export let roomId: string = '';
  export let status: string = 'waiting';
  export let onCopyLink: () => void;
  export let onNameChange: (name: string) => void;
  
  let username = '';
  
  function handleNameChange() {
    if (username.trim()) {
      onNameChange(username);
    }
  }
  
  $: if (username) handleNameChange();
</script>

<div class="card bg-base-100 shadow-xl mb-6">
  <div class="card-body">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div class="flex-1">
        <h1 class="card-title text-2xl md:text-3xl font-bold">
          {roomName || "Loading..."}
          <div class="badge badge-lg ml-2">
            {status}
          </div>
        </h1>
        <p class="text-sm opacity-70 mt-1">
          Room ID: {roomId}
          <button class="btn btn-ghost btn-xs" on:click={onCopyLink}>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
            </svg>
            Copy Link
          </button>
        </p>
      </div>
      
      <div class="w-full md:w-64">
        <div class="form-control">
          <label class="label">
            <span class="label-text">Your Name</span>
          </label>
          <div class="relative">
            <input 
              type="text" 
              class="input input-bordered w-full" 
              placeholder="Enter your name"
              bind:value={username}
              on:blur={handleNameChange}
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

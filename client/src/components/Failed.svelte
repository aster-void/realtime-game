<script lang="ts" module>
export { failed };
</script>

{#snippet failed(error: unknown, reset: () => void)}
<div class="flex flex-col items-center justify-center h-screen font-sans text-center">
    <h1 class="text-3xl">Something went wrong</h1>
    <pre class="text-sm">{"message" in (error as Error) ? (error as Error).message : "Unknown error"}</pre>
    <button class="mt-4 btn btn-primary" onclick={reset}>Try again</button>
</div>
{/snippet}
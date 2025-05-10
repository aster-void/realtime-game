<script lang="ts">
import "../app.css";
import { useStateProvider } from "../src/global.sveltete";
const { children } = $props();
useStateProvider();
</script>

{@render children()}

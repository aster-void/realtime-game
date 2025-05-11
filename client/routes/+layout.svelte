<script lang="ts">
import "~/app.css";
import type { Snippet } from "svelte";
import Header from "~/components/Header.svelte";

type Props = {
  children: Snippet;
};
const { children }: Props = $props();
</script>

<Header />
{@render children()}
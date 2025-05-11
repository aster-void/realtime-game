<script lang="ts">
import "~/app.css";
import type { Snippet } from "svelte";
import { failed } from "~/components/Failed.svelte";
import Header from "~/components/Header.svelte";
import { GlobalController } from "~/controller/global.svelte";

type Props = {
  children: Snippet;
};
new GlobalController();
const { children }: Props = $props();
</script>

<Header />
<svelte:boundary failed={failed}>
{@render children()}
</svelte:boundary>
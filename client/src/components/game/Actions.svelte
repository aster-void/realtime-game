<script lang="ts">
import type { Hand } from "@repo/share/types";
import { hands } from "~/lib/hands.ts";

type Props = {
  onaction: (hand: Hand) => void;
  disabled?: boolean;
};
const { onaction, disabled }: Props = $props();
</script>

<div class="card bg-base-100 shadow-xl">    
    <div class="card-body">
        <ul class="space-y-2">
          {#each hands as hand}
            <li>
              <button class="btn btn-outline w-full" onclick={() => onaction(hand)} disabled={disabled}>
                {hand}
              </button>
            </li>
          {/each}
        </ul>
    </div>
</div>

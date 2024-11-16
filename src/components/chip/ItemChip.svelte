<script lang="ts">
  import type { PortfolioGlobals } from '$lib';
  import Chip from './Chip.svelte';

  type Props = {
    globals: PortfolioGlobals;
    groupId: string;
    itemId: string;
    link?: boolean;
    selected?: boolean;
    /** Callback for when the element is clicked */
    onclick?: (e: MouseEvent | undefined | null) => void;
  };

  let {
    globals,
    groupId,
    itemId,
    link = false,
    selected = false,
  }: Props = $props();

  let item = $derived(globals.items[groupId][itemId]);
</script>

<Chip
  name={item.info.name}
  description={item.info.description}
  color={item.info.color}
  {selected}
  link={link ? { url: `/${groupId}/${itemId}`, newTab: false } : undefined}
/>

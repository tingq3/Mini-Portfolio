<script lang="ts">
  import type { PortfolioGlobals } from '$lib';
  import Chip from './Chip.svelte';

  interface Props {
    globals: PortfolioGlobals;
    groupId: string;
    itemId: string;
    link?: boolean;
    selected?: boolean;
  }

  let {
    globals,
    groupId,
    itemId,
    link = false,
    selected = false
  }: Props = $props();

  let item = $derived(globals.items[groupId][itemId]);
</script>

<Chip
  on:click
  name={item.info.name}
  description={item.info.description}
  color={item.info.color}
  {selected}
  link={link ? `/${groupId}/${itemId}` : undefined}
/>

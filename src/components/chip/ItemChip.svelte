<script lang="ts">
  import type { PortfolioGlobals } from '$lib';
  import Chip from './Chip.svelte';

  export let globals: PortfolioGlobals;
  export let groupId: string;
  export let itemId: string;
  export let link = false;
  export let selected = false;

  $: item = globals.items[groupId][itemId];
</script>

<Chip
  on:click
  name={item.info.name}
  description={item.info.description}
  color={item.info.color}
  {selected}
  link={link ? `/${groupId}/${itemId}` : undefined}
/>

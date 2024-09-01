<script lang="ts">
  import type { PortfolioGlobals } from '$lib';
  import Chip from './Chip.svelte';

  export let globals: PortfolioGlobals;
  export let groupId: string;
  export let link: boolean = false;
  export let selected: boolean = false;

  $: group = globals.groups[groupId];
</script>

<Chip
  on:click
  name={group.info.name}
  description={group.info.description}
  color={group.info.color}
  {selected}
  link={link ? `/${groupId}` : undefined}
/>

<script lang="ts">
  import type { PortfolioGlobals } from '$lib';
  import Chip from './Chip.svelte';

  interface Props {
    globals: PortfolioGlobals;
    groupId: string;
    link?: boolean;
    selected?: boolean;
  }

  let {
    globals,
    groupId,
    link = false,
    selected = false
  }: Props = $props();

  let group = $derived(globals.groups[groupId]);
</script>

<Chip
  on:click
  name={group.info.name}
  description={group.info.description}
  color={group.info.color}
  {selected}
  link={link ? `/${groupId}` : undefined}
/>

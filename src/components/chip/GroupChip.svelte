<script lang="ts">
  import type { PortfolioGlobals } from '$lib';
  import Chip from './Chip.svelte';

  type Props = {
    globals: PortfolioGlobals;
    groupId: string;
    link?: boolean;
    selected?: boolean;
    onclick?: (e: MouseEvent | undefined | null) => void;
  };

  let {
    globals,
    groupId,
    onclick,
    link = false,
    selected = false,
  }: Props = $props();

  let group = $derived(globals.groups[groupId]);
</script>

<Chip
  {onclick}
  name={group.info.name}
  description={group.info.description}
  color={group.info.color}
  {selected}
  link={link ? { url: `/${groupId}`, newTab: false } : undefined}
/>

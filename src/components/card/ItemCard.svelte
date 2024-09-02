<script lang="ts">
  import { type PortfolioGlobals } from '$lib';
  import Card from './Card.svelte';
  import { ItemChipList } from '$components/chip';

  export let globals: PortfolioGlobals;
  /** Group ID of item to show */
  export let groupId: string;
  /** Item ID of item to show */
  export let itemId: string;
  /** Whether edit mode is active */
  export let editing: boolean;

  $: item = globals.items[groupId][itemId];
  $: associatedChips = item.info.links
    .filter(([{ style }]) => style === 'chip')
    .map(([{ groupId }, items]) => items.map(itemId => ({ groupId, itemId, selected: false })));
</script>

<Card
  link={editing ? false : `/${groupId}/${itemId}`}
  color={item.info.color}
  on:click
  hasIcon={!!item.info.icon}
>
  <div slot="icon">
    {#if item.info.icon}
      <img
        src="/{groupId}/{itemId}/{item.info.icon}"
        alt="Icon for {item.info.name}"
        class="label-icon"
      />
    {/if}
  </div>
  <div>
    <h3>{item.info.name}</h3>
    <p>{item.info.description}</p>
  </div>
  <div slot="bottom">
    {#if !editing}
      <ItemChipList items={associatedChips} {globals} link />
    {/if}
  </div>
</Card>

<style>
  h3 {
    margin-bottom: 0;
  }

  .label-icon {
    width: 100%;
    border-radius: 15px;
  }
</style>

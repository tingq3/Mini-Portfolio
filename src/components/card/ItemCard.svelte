<script lang="ts">
  import { type PortfolioGlobals } from '$lib';
  import Card from './Card.svelte';
  import { ItemChipList } from '$components/chip';




  interface Props {
    globals: PortfolioGlobals;
    /** Group ID of item to show */
    groupId: string;
    /** Item ID of item to show */
    itemId: string;
    /** Whether edit mode is active */
    editing: boolean;
  }

  let {
    globals,
    groupId,
    itemId,
    editing
  }: Props = $props();

  let item = $derived(globals.items[groupId][itemId]);
  let associatedChips = $derived(item.info.links
    .filter(([{ style }]) => style === 'chip')
    .map(([{ groupId }, items]) => items.map(itemId => ({ groupId, itemId, selected: false }))));
</script>

<Card
  link={editing ? false : `/${groupId}/${itemId}`}
  color={item.info.color}
  on:click
>
  {#if item.info.icon}
    {#snippet icon()}
      <div >
        <img
          src="/{groupId}/{itemId}/{item.info.icon}"
          alt="Icon for {item.info.name}"
          class="label-icon"
        />
      </div>
    {/snippet}
  {/if}
  <div>
    <h3>{item.info.name}</h3>
    <p>{item.info.description}</p>
  </div>
  {#if !editing}
    {#snippet bottom()}
      <div >
        <ItemChipList items={associatedChips} {globals} link />
      </div>
    {/snippet}
  {/if}
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

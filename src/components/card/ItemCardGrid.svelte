<script lang="ts">
  import { flip } from 'svelte/animate';
  import { ItemCard } from '.';
  import type { PortfolioGlobals } from '$lib';
  import { createEventDispatcher } from 'svelte';
  import { send, receive } from '$lib/transition';
  import IconCard from './IconCard.svelte';
  import { NewItemModal } from '$components/modals';

  /** Portfolio globals */
  export let globals: PortfolioGlobals;
  /** ID of group to which items belong */
  export let groupId: string;
  /** Item IDs to show */
  export let itemIds: string[];
  /** Whether edit mode is active */
  export let editing: boolean;
  /** Whether to give the option to create an item in edit mode */
  export let createOption: boolean = false;

  const dispatch = createEventDispatcher<{
    click: { itemId: string },
  }>();

  let newItemModalShown = false;
  function closeNewItemModal() {
    newItemModalShown = false;
  }
</script>

<div class="card-grid">
  {#each itemIds as itemId (itemId)}
    <div
    animate:flip={{ duration: 300 }}
    in:receive={{ key: itemId }}
    out:send={{ key: itemId }}
    >
      <ItemCard
        {groupId}
        {itemId}
        {globals}
        {editing}
        on:click={() => dispatch('click', { itemId })}
      />
    </div>
  {/each}
  {#if editing && createOption}
    <IconCard
      title="New item"
      color="#888888"
      on:click={() => { newItemModalShown = true; }}
    >
      <i slot="icon" class="las la-plus"></i>
    </IconCard>
    <NewItemModal {groupId} show={newItemModalShown} on:close={closeNewItemModal} />
  {/if}
</div>

<style>
  .card-grid {
    /* https://css-tricks.com/an-auto-filling-css-grid-with-max-columns/ */
    /**
    * User input values.
    */
    --grid-layout-gap: 20px;
    --grid-column-count: 3;
    --grid-item--min-width: 30em;

    /**
    * Calculated values.
    */
    --gap-count: calc(var(--grid-column-count) - 1);
    --total-gap-width: calc(var(--gap-count) * var(--grid-layout-gap));
    --grid-item--max-width: calc((100% - var(--total-gap-width)) / var(--grid-column-count));

    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(max(var(--grid-item--min-width), var(--grid-item--max-width)), 1fr));
    grid-gap: var(--grid-layout-gap);
  }

  /* ✨ responsive design ✨ */
  @media only screen and (max-width: 600px) {
    .card-grid {
      display: flex;
      flex-direction: column;
      max-width: 100%;
    }
  }
</style>

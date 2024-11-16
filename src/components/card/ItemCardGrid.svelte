<script lang="ts">
  import { flip } from 'svelte/animate';
  import { ItemCard } from '.';
  import type { PortfolioGlobals } from '$lib';
  import { send, receive } from '$lib/transition';
  import IconCard from './IconCard.svelte';
  import { NewItemModal } from '$components/modals';

  type Props = {
    globals: PortfolioGlobals;
    /** ID of group to which items belong */
    groupId: string;
    /** Item IDs to show */
    itemIds: string[];
    /** Whether edit mode is active */
    editing: boolean;
    /** Whether to give the option to create a group in edit mode */
    createOption?: boolean;
    /** Called when an item is clicked */
    onclick: (groupId: string, itemId: string) => void;
  };

  let {
    globals,
    groupId,
    itemIds,
    editing,
    onclick,
    createOption = false,
  }: Props = $props();

  let newItemModalShown = $state(false);
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
        onclick={() => onclick(groupId, itemId)}
      />
    </div>
  {/each}
  {#if editing && createOption}
    <IconCard
      title="New item"
      color="#888888"
      onclick={() => {
        newItemModalShown = true;
      }}
    >
      {#snippet icon()}
        <i class="las la-plus"></i>
      {/snippet}
    </IconCard>
    <NewItemModal
      {groupId}
      show={newItemModalShown}
      onclose={closeNewItemModal}
    />
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
    --grid-item--max-width: calc(
      (100% - var(--total-gap-width)) / var(--grid-column-count)
    );

    display: grid;
    grid-template-columns: repeat(
      auto-fill,
      minmax(max(var(--grid-item--min-width), var(--grid-item--max-width)), 1fr)
    );
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

<script lang="ts">
  import { flip } from 'svelte/animate';
  import { fade } from 'svelte/transition';
  import { ItemCard } from '.';
  import type { PortfolioGlobals } from '$lib';

  /** Portfolio globals */
  export let globals: PortfolioGlobals;
  /** ID of group to which items belong */
  export let groupId: string;
  /** Item IDs to show */
  export let itemIds: string[];
</script>

<div class="card-grid">
  {#each itemIds as itemId (itemId)}
    <div
      transition:fade={{ duration: 300 }}
      animate:flip={{ duration: 300 }}
    >
      <ItemCard
        {groupId}
        {itemId}
        {globals}
      />
    </div>
  {/each}
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

<script lang="ts">
  // FIXME: Code duplication between here and ItemCardGrid -- need to figure
  // out a nice way to do generics in Svelte
  import { flip } from 'svelte/animate';
  import GroupCard from './GroupCard.svelte';
  import type { PortfolioGlobals } from '$lib';
  import { createEventDispatcher } from 'svelte';
  import { send, receive } from '$lib/transition';
  import IconCard from './IconCard.svelte';
  import { NewGroupModal } from '$components/modals';

  export let globals: PortfolioGlobals;
  /** Groups to display */
  export let groups: string[];
  /** Whether edit mode is active */
  export let editing: boolean;
  /** Whether to give the option to create a group in edit mode */
  export let createOption: boolean = false;

  const dispatch = createEventDispatcher<{
    click: { groupId: string },
  }>();

  // Logic for new group modal
  let newGroupModalShown = false;
  function closeNewGroupModal() {
    newGroupModalShown = false;
  }
</script>

<div class="card-grid">
  {#each groups as groupId (groupId)}
    <div
      animate:flip={{ duration: 300 }}
      in:receive={{ key: groupId }}
      out:send={{ key: groupId }}
    >
      <GroupCard
        {globals}
        {groupId}
        {editing}
        on:click={() => dispatch('click', { groupId })}
      />
    </div>
  {/each}
  {#if editing && createOption}
    <IconCard
      title="New group"
      color="#888888"
      on:click={() => { newGroupModalShown = true; }}
    >
      <i slot="icon" class="las la-plus"></i>
    </IconCard>
    <NewGroupModal show={newGroupModalShown} on:close={closeNewGroupModal} />
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

<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { ItemChip } from '.';
  import type { PortfolioGlobals } from '$lib';
  import { Separator } from '$components';
  import type { FilterOptions } from '$lib/itemFilter';

  type Props = {
    /** Global data */
    globals: PortfolioGlobals;
    /**
     * Filter options to display
     */
    items: FilterOptions;
    /** Whether to link each chip to its respective page */
    link?: boolean;
  };

  let { globals, items, link = false }: Props = $props();

  // Smoooooooooooth scrolling
  // ==================================================

  /** Reference to this element  */
  let ele: HTMLDivElement | undefined = $state();
  /**
   * Scroll position we are aiming for (used to prevent smooth scroll jank)
   */
  let targetScrollPosition = 0;
  let lastScrollPosition = 0;

  /** Event handler for scrolling on the element */
  function onWheel(
    e: WheelEvent & { currentTarget: EventTarget & HTMLDivElement },
  ) {
    // Ensure element has been mounted
    if (!ele) return;
    // Didn't scroll vertically, so ignore it
    if (e.deltaY === 0) {
      return;
    }
    // Can't scroll horizontally, so ignore it
    if (ele.scrollWidth === ele.clientWidth) {
      return;
    }
    // If scrolling changed direction, reset the target to the current
    // position to prevent jank
    if (
      // Aiming further left but we're scrolling right
      (targetScrollPosition > ele.scrollLeft && e.deltaY < 0) ||
      // Aiming further right but we're scrolling left
      (targetScrollPosition < ele.scrollLeft && e.deltaY > 0)
    ) {
      targetScrollPosition = ele.scrollLeft;
    }
    // Move target position, but only if it's within the required range
    targetScrollPosition = Math.max(
      0,
      Math.min(
        ele.scrollWidth - ele.clientWidth,
        targetScrollPosition + e.deltaY,
      ),
    );
    // If scroll distance is too small, just scroll instantly
    // This should reduce jank for people scrolling with trackpads
    let behavior: ScrollBehavior = 'smooth';
    if (e.deltaY > -100 && e.deltaY < 100) {
      behavior = 'instant';
    }
    ele.scrollTo({ left: targetScrollPosition, behavior });
    e.preventDefault();
  }

  // Update the target scroll position to match the current position whenever
  // we aren't scrolling.
  //
  // Firefox gives a warning about this causing issues, because it thinks
  // we're using the `targetScrollPosition` to move things around on the page
  // In reality, this seems to be mostly fine -- it's a teensy bit janky but
  // not irredeemably so.
  onMount(() => {
    const interval = setInterval(() => {
      if (!ele) {
        return;
      }
      if (ele.scrollLeft === lastScrollPosition) {
        // Scroll didn't change therefore we should update target position
        // to prevent jank
        targetScrollPosition = ele.scrollLeft;
      } else {
        // Otherwise, update the last scroll position to this position
        lastScrollPosition = ele.scrollLeft;
      }
    }, 100);
    return () => clearInterval(interval);
  });

  // Filtering

  const dispatch = createEventDispatcher<{
    filter: FilterOptions;
    click: { groupId: string; itemId: string };
  }>();

  // Update filter status
  function updateFilterStatus(outerIdx: number, innerIdx: number) {
    const newItems = structuredClone(items);
    newItems[outerIdx][innerIdx].selected = !items[outerIdx][innerIdx].selected;
    dispatch('filter', newItems);
  }
</script>

{#if items.length}
  <div class="chip-list" bind:this={ele} onwheel={onWheel}>
    {#each items as itemGroup, outer}
      {#each itemGroup as filterItem, inner}
        <ItemChip
          {globals}
          groupId={filterItem.groupId}
          itemId={filterItem.itemId}
          selected={filterItem.selected}
          {link}
          onclick={() => {
            updateFilterStatus(outer, inner);
            dispatch('click', {
              groupId: filterItem.groupId,
              itemId: filterItem.itemId,
            });
          }}
        />
      {/each}
      <!-- Last classifier doesn't have a separator -->
      {#if outer < items.length - 1}
        <Separator />
      {/if}
    {/each}
  </div>
{/if}

<style>
  .chip-list {
    margin: 0 5px;
    padding-bottom: 5px;
    display: flex;
    gap: 5px;
    align-items: center;
    overflow-y: hidden;
    /* Scroll only if overflowing */
    overflow-x: auto;
    scrollbar-width: thin;
  }
</style>

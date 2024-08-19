<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { Separator } from '$components';
  import { type ClassifierSlug, type Label, type LabelSlug } from '$types';
  import { ItemChip } from '.';
  import type { OrderedRecord } from '$lib/OrderedRecord';

  /** Labels to use as chips, grouped by classifier */
  export let labels: OrderedRecord<
    ClassifierSlug,
    OrderedRecord<
    LabelSlug,
    { label: Label, selected?: boolean }
    >
  >;
  /** Whether to link each chip to its respective page */
  export let link: boolean = false;

  // Dispatch clicks on the chips to be forwarded alongside their classifier
  // and label
  const dispatch = createEventDispatcher<{
    click: {
      classifier: ClassifierSlug,
      label: LabelSlug,
      e: MouseEvent,
    },
  }>();

  const bubbleClick = (classifier: ClassifierSlug, label: LabelSlug, e: MouseEvent) => {
    dispatch('click', {
      classifier,
      label,
      e,
    });
  };

  // Smoooooooooooth scrolling
  // ==================================================

  /** Reference to this element  */
  let ele: HTMLDivElement;
  /**
   * Scroll position we are aiming for (used to prevent smooth scroll jank)
   */
  let targetScrollPosition = 0;
  let lastScrollPosition = 0;

  /** Event handler for scrolling on the element */
  function onWheel(e: WheelEvent & { currentTarget: EventTarget & HTMLDivElement }) {
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
      (targetScrollPosition > ele.scrollLeft && e.deltaY < 0)
      // Aiming further right but we're scrolling left
      || (targetScrollPosition < ele.scrollLeft && e.deltaY > 0)
    ) {
      targetScrollPosition = ele.scrollLeft;
    }
    // Move target position, but only if it's within the required range
    targetScrollPosition = Math.max(
      0,
      Math.min(
        ele.scrollWidth - ele.clientWidth,
        targetScrollPosition + e.deltaY
      )
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
</script>

{#if labels.keys().length}
  <div
    class="chip-list"
    bind:this={ele}
    on:wheel={onWheel}
  >
    {#each labels.values().slice(0, -1) as labelGroup}
      {#each labelGroup.values() as { label, selected }}
        <ItemChip
          {label}
          {selected}
          {link}
          on:click={e => bubbleClick(label.classifier, label.slug, e)}
        />
      {/each}
      <Separator />
    {/each}
    <!-- Last classifier doesn't have a separator -->
    {#each labels.values().slice(-1)[0].values() as { label, selected }}
      <ItemChip
        {label}
        {selected}
        {link}
        on:click={e => bubbleClick(label.classifier, label.slug, e)}
      />
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

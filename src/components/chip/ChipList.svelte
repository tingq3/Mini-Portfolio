<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { Separator } from '$components';
    import { type ClassifierSlug, type Label, type LabelSlug } from '$types';
    import { LabelChip } from '.';
    import type { OrderedRecord } from '$lib/OrderedRecord';

    /** Labels to use as chips, grouped by classifier */
    export let labels: OrderedRecord<
      ClassifierSlug,
      OrderedRecord<
      LabelSlug,
      { label: Label, selected?: boolean }
      >
    >;

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
</script>

{#if labels.keys().length}
    <div class="chip-list">
        {#each labels.values().slice(0, -1) as labelGroup}
            {#each labelGroup.values() as { label, selected }}
                <LabelChip
                    {label}
                    {selected}
                    on:click={e => bubbleClick(label.classifier, label.slug, e)}
                />
            {/each}
            <Separator />
        {/each}
        <!-- Last classifier doesn't have a separator -->
        {#each labels.values().slice(-1)[0].values() as { label, selected }}
            <LabelChip
                {label}
                {selected}
                on:click={e => bubbleClick(label.classifier, label.slug, e)}
            />
        {/each}
    </div>
{/if}

<style>
    div {
        overflow: scroll;
        padding-bottom: 5px;
        display: flex;
        gap: 5px;
        align-items: center;
    }
</style>

<script lang="ts">
    import { type PortfolioGlobals, type Label, type ClassifierSlug } from '$types';
    import Card from './Card.svelte';
    import { ChipList, LabelChip } from '$components/chip';
    import { Separator } from '..';

    export let label: Label;
    export let globals: PortfolioGlobals;

    $: usedClassifiers = globals.classifierOrder.filter(c => c in label.info.associations);
</script>

<Card
    link="/{label.classifier}/{label.slug}"
    title={label.info.name}
    color={label.info.color}
>
    <p>{label.info.description}</p>
    {#if usedClassifiers.length}
        <ChipList>
            {#each usedClassifiers.slice(0, -1) as classifier}
                {#each label.info.associations[classifier] as linkedLabel}
                    <LabelChip label={globals.classifiers[classifier].labels[linkedLabel]} />
                {/each}
                <Separator />
            {/each}
            <!-- Last classifier doesn't have a separator -->
            {#each label.info.associations[usedClassifiers.slice(-1)[0]] as linkedLabel}
                <LabelChip label={globals.classifiers[usedClassifiers.slice(-1)[0]].labels[linkedLabel]} />
            {/each}
        </ChipList>
    {/if}
</Card>

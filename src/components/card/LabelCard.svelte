<script lang="ts">
    import { type PortfolioGlobals, type Label, type ClassifierSlug, type LabelSlug } from '$types';
    import Card from './Card.svelte';
    import { ChipList } from '$components/chip';
    import { getAssociatedLabels } from '$lib/util';

    export let label: Label;
    export let globals: PortfolioGlobals;

    // List of associated labels, grouped by classifier
    $: associatedLabels = getAssociatedLabels(globals, label);
</script>

<Card
  link="/{label.classifier}/{label.slug}"
  color={label.info.color}
>
  <h3 slot="top">{label.info.name}</h3>
  <p>{label.info.description}</p>
  <ChipList slot="bottom" labels={associatedLabels} link={true} />
</Card>

<style>
  h3 {
    margin-bottom: 0;
  }
</style>

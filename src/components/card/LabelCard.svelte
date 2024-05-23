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
  title={label.info.name}
  color={label.info.color}
>
  <p>{label.info.description}</p>
  <ChipList labels={associatedLabels} link={true} />
</Card>

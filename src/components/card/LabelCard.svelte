<script lang="ts">
    import { type PortfolioGlobals, type Label, type ClassifierSlug, type LabelSlug } from '$types';
    import Card from './Card.svelte';
    import { ChipList } from '$components/chip';
    import { orderedRecord, type OrderedRecord } from '$lib/orderedRecord';

    export let label: Label;
    export let globals: PortfolioGlobals;

    // List of classifier slugs associated by this label
    $: usedClassifiers = globals.classifiers.keys().filter(c => c in label.info.associations);
    // List of associated labels, grouped by classifier
    $: associatedLabels = orderedRecord(
      // This feels absolutely disgusting but I simply cannot think of a nicer
      // way to do it
      Object.fromEntries(usedClassifiers.map(
        c => [
          c,
          orderedRecord(
            Object.fromEntries(
              label.info.associations[c].map(slug => [
                slug,
                { label: globals.classifiers.get(c).labels.get(slug) }
              ]),
            ),
            label.info.associations[c],
          ),
        // Another manual type cast because Object.fromEntries is kinda stupid
        ] as [ClassifierSlug, OrderedRecord<LabelSlug, { label: Label}>]
      )),
      usedClassifiers,
    );
</script>

<Card
    link="/{label.classifier}/{label.slug}"
    title={label.info.name}
    color={label.info.color}
>
    <p>{label.info.description}</p>
    <ChipList labels={associatedLabels} />
</Card>

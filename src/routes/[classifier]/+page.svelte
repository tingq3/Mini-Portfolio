<script lang="ts">
    import { flip } from 'svelte/animate';
    import { fade } from 'svelte/transition';

    import { Navbar, Markdown } from '$components';
    import { LabelCard } from '$components/card';
    import { ChipList } from '$components/chip';
    import type { ClassifierSlug, Label, LabelSlug } from '$types';
    import OrdRec, { type OrderedRecord } from '$lib/OrderedRecord';

    export let data: import('./$types').PageData;

    /**
     * Silence type-checking errors in Svelte components, since there seems to
     * be no way to use a <!-- HTML comment --> to silence them
     *
     * Source: https://github.com/sveltejs/language-tools/issues/1026#issuecomment-1002839154
     */
    const noTypeCheck = (x: any) => x;

    const globalClassifiers = OrdRec.fromItems(data.globals.classifiers);

    const classifier = globalClassifiers.get(data.classifier);

    // Start with all labels within this classifier selected
    let selectedEntries = [...OrdRec.fromItems(classifier.labels).keys()];

    // And start with no filters selected
    // selectedFilters is a mapping from classifiers to their labels, with each
    // label having a boolean to indicate whether it is selected
    let selectedFilters: OrderedRecord<
      ClassifierSlug,
      OrderedRecord<LabelSlug, boolean>
    > = OrdRec.fromRecord(
      // Create an OrderedRecord<LabelSlug, boolean> for each classifier in the
      // list of classifiers to filter by
      Object.fromEntries(
        classifier.info.filterClassifiers.map(
          c => {
            // Look up classifier to filter by
            const filterC = globalClassifiers.get(c);
            // Return the entry
            return [
              // The classifier slug
              c,
              // An ordered record mapping label slugs to the boolean false
              // meaning all filters are deselected by default
              OrdRec.fromRecord(
                Object.fromEntries(
                  OrdRec.fromItems(filterC.labels)
                    .keys()
                    // WHY OH WHY do I need to perform this type cast here?
                    // Why does TypeScript not realise that false is a subset of
                    // boolean?
                    // This hurts my soul on a spiritual level
                    .map(k => [k, false] as [LabelSlug, boolean]),
                ),
                OrdRec.fromItems(filterC.labels).keys(),
              )
            ];
          }
        )
      ),
      classifier.info.filterClassifiers,
    );

    /**
     * Given an entry within the page classifier, return whether it has a
     * link to the label with the given classifier and label slugs.
     */
    function entryLinksToFilter(
      entry: Label,
      filterClassifier: ClassifierSlug,
      filterLabel: LabelSlug,
    ): boolean {
      const associationsWithClassifier = entry.info.associations[filterClassifier];
      if (associationsWithClassifier === undefined) {
        return false;
      }
      return associationsWithClassifier.includes(filterLabel);
    }

    /**
     * Update filtered list of projects based on current language chip
     * selection.
     */
    function updateProjectList() {
      let newSelections = [...OrdRec.fromItems(classifier.labels).keys()];

      for (const [filterClassifier, labels] of selectedFilters.items()) {
        // Whether we should filter elements using this classifier
        // This is set to `true` if there is a selected filter label
        let useFilter = false;
        // Build a list of all entries matched by this classifier so we can
        // union the search within this classifier, but do an intersection
        // between classifiers
        const entriesMatchedHere: LabelSlug[] = [];
        for (const [filterLabel, filterSelected] of labels.items()) {
          // If this filter is selected
          if (filterSelected) {
            useFilter = true;
            // Find entries linked by this particular label from the previous
            // iteration
            const matches = newSelections
              .filter(entry => entryLinksToFilter(
                OrdRec.fromItems(classifier.labels).get(entry),
                filterClassifier,
                filterLabel,
              ));

            // For each match, add it to the array of matches if it hasn't
            // already been found
            for (const match of matches) {
              if (!entriesMatchedHere.includes(match)) {
                entriesMatchedHere.push(match);
              }
            }
          }
        }
        // Now update the overall selections if an entry in this label was
        // selected
        if (useFilter) {
          // Using a filter rather than just using the `entriesMatchedHere`
          // list to preserve the order
          newSelections = newSelections.filter(e => entriesMatchedHere.includes(e));
        }
      }

      selectedEntries = newSelections;
    }

    /** Called when a language chip is clicked */
    function selectFilter(classifier: ClassifierSlug, label: LabelSlug) {
      // Toggle the filter selection
      selectedFilters.get(classifier).set(
        label,
        !selectedFilters.get(classifier).get(label)
      );
      // Replace selectedFilters so that the reactivity works
      selectedFilters = { ...selectedFilters };
      updateProjectList();
    }
</script>

<Navbar path={[]} globals={data.globals} />

<Markdown source={classifier.readme} />

<!-- List the labels which we can use to filter entries -->
<ChipList
  labels={
    // I can't figure out how to make the OrderedRecord type be covariant, so
    // I'm getting a super annoying error because it's not allowing `boolean`
    // to be compatible with `boolean | undefined`. Just silencing it with a
    // function that converts it to `any` because you annoyingly can't use
    // TypeScript within template markup.
    // I hate the fact that this means that there is no type checking for the
    // entire component. I'll just have to be super careful to make sure that
    // it works correctly
    noTypeCheck(selectedFilters.map((c, v) => v.map((l, selected) => ({
      label: OrdRec.fromItems(
        OrdRec.fromItems(data.globals.classifiers).get(c).labels
      ).get(l),
      selected,
    }))))
  }
  on:click={e => {
    // When a label is clicked, toggle its selection
    const { classifier, label } = e.detail;
    selectFilter(classifier, label);
  }}
/>

<!-- List all entry cards -->
<div class="project-list">
    {#each selectedEntries as entrySlug (entrySlug)}
    <div
        transition:fade={{ duration: 300 }}
        animate:flip={{ duration: 300 }}
    >
        <LabelCard
            label={OrdRec.fromItems(classifier.labels).get(entrySlug)}
            globals={data.globals}
        />
    </div>
    {/each}
</div>

<style>
    /* https://css-tricks.com/an-auto-filling-css-grid-with-max-columns/ */
    .project-list {
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
</style>

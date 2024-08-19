<script lang="ts">
    import { Navbar, Markdown } from '$components';
    import { CardGrid } from '$components/card';
    import { ChipList } from '$components/chip';
    import type { ClassifierSlug, Label, LabelSlug } from '$types';
    import OrdRec from '$lib/OrderedRecord';
    import { visibilityFilter } from '$lib/visibility';
    import { onMount } from 'svelte';
    import Background from '$components/Background.svelte';
    import { applyParamsToFilter, filterToParams as filterToString } from './filterSerialize';

    export let data: import('./$types').PageData;

    /**
     * Silence type-checking errors in Svelte components, since there seems to
     * be no way to use a <!-- HTML comment --> to silence them
     *
     * Source: https://github.com/sveltejs/language-tools/issues/1026#issuecomment-1002839154
     */
    const noTypeCheck = (x: any) => x;

    $: globalClassifiers = OrdRec.fromItems(data.globals.classifiers);
    $: classifier = globalClassifiers.get(data.classifier);

    // Start with all labels within this classifier selected
    $: selectedEntries = [...OrdRec.fromItems(classifier.labels).keys()];

    // And start with no filters selected
    // selectedFilters is a mapping from classifiers to their labels, with each
    // label having a boolean to indicate whether it is selected
    $: selectedFilters = OrdRec.fromRecord(
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
                OrdRec.fromItems(filterC.labels)
                  // Filter out items that aren't supposed to show in filters
                  .filter(visibilityFilter('filtered'))
                  .keys(),
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

      // Update the query string with the current filters
      const url = new URL(window.location.href);
      const filterString = filterToString(selectedFilters);
      // Only add the filter property if it actually contains information
      if (filterString.length) {
        url.searchParams.set('filter', filterString);
      } else {
        // Remove filter property entirely
        url.searchParams.delete('filter');
      }
      window.history.pushState(null, '', url.toString());
    }

    // Apply filters from query string
    onMount(() => {
      const params = new URLSearchParams(window.location.search);
      const filterString = params.get('filter');
      if (filterString) {
        applyParamsToFilter(selectedFilters, filterString);
        // Replace selectedFilters so that the reactivity works
        selectedFilters = { ...selectedFilters };
        updateProjectList();
      }
    });
</script>

<Background color={classifier.info.color} />

<Navbar
    path={[{ url: classifier.slug, txt: classifier.info.name }]}
    globals={data.globals}
/>

<main>
  <div id="readme">
    <div>
      <Markdown source={classifier.readme} />
    </div>
  </div>

  <div id="filters">
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
  </div>

  <!-- List all entry cards -->
  <div id="project-list">
    <CardGrid
      group={classifier}
      entries={selectedEntries}
      globals={data.globals}
    />
  </div>
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }
  #readme {
    width: 100%;
  }
  #readme > div {
    margin: 5px;
  }
  #filters {
    width: 100%;
  }
  #project-list {
    width: 100%;
  }

</style>

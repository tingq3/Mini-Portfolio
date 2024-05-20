<script lang="ts">
    import { flip } from 'svelte/animate';
    import { fade } from 'svelte/transition';

    import { Navbar, Markdown } from '$components';
    import { LabelCard } from '$components/card';
    import { ChipList, LabelChip } from '$components/chip';
    import { filterLabelsByAssociations } from '$lib/util';
    import type { ClassifierSlug, Label, LabelSlug } from '$types';

    export let data: import('./$types').PageData;

    const classifier = data.globals.classifiers[data.classifier];

    // Start with all labels within this classifier selected
    let selectedEntries = [...classifier.labelOrder];
    // And start with no filters selected (ie each entry is an empty array)
    let selectedFilters: Record<ClassifierSlug, LabelSlug[]> = Object.fromEntries(
      classifier.info.filterClassifiers
        .map(c => [c, []])
    );

    /**
     * Update filtered list of projects based on current language chip
     * selection
     */
    function updateProjectList() {
      let newSelections = [...classifier.labelOrder];

      function entryLinksToFilter(entry: LabelSlug, filterClassifier: ClassifierSlug, filterLabel: LabelSlug): boolean {
        const associationsWithClassifier = classifier.labels[entry].info.associations[filterClassifier];
        if (associationsWithClassifier === undefined) {
          return false;
        }
        return associationsWithClassifier.includes(filterLabel);
      }

      for (const filterClassifier of classifier.info.filterClassifiers) {
        for (const filterLabel of selectedFilters[filterClassifier]) {
          newSelections = newSelections
            .filter(entry => entryLinksToFilter(entry, filterClassifier, filterLabel));
        }
      }

      selectedEntries = newSelections;
    }

    /** Called when a language chip is clicked */
    function selectFilter(classifier: ClassifierSlug, label: LabelSlug) {
      if (selectedFilters[classifier].includes(label)) {
        // Filter already selected, remove it
        selectedFilters[classifier] = selectedFilters[classifier].filter(l => l !== label);
      } else {
        // Filter not selected
        selectedFilters[classifier].push(label);
      }
      // Replace selectedFilters so that the reactivity works
      selectedFilters = { ...selectedFilters };
      updateProjectList();
    }
</script>

<Navbar path={[]} globals={data.globals} />

<Markdown source={classifier.readme} />

<h2>{classifier.info.name}</h2>

<ChipList>
    <!-- TODO: List all filter chips -->
    {#each data.languages as lang (lang.slug)}
        <LanguageChip
            on:click={() => selectFilter(lang.slug)}
            selected={selectedFilters.includes(lang.slug)}
            info={lang}
        />
    {/each}
</ChipList>

<!-- TODO: List all entry cards -->
<div class="project-list">
    {#each selectedEntries as info (info.slug)}
    <div
        transition:fade={{ duration: 300 }}
        animate:flip={{ duration: 300 }}
    >
        <ProjectCard
            {info}
            languages={data.languagesMap}
            frameworks={data.frameworksMap}
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

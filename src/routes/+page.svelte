<script lang="ts">
    import { flip } from 'svelte/animate';
    import { fade } from 'svelte/transition';

    import { filterProjectsByLanguages } from '$lib/util';

    import { Navbar, Markdown } from '$components';
    import { ProjectCard } from '$components/card';
    import { ChipList, LanguageChip } from '$components/chip';

    export let data: import('./$types').PageData;

    let selectedProjects = [...data.projects];
    let selectedLangs: string[] = [];

    /**
     * Update filtered list of projects based on current language chip
     * selection
     */
    function updateProjectList() {
      if (selectedLangs.length === 0) {
        selectedProjects = [...data.projects];
        return;
      }

      selectedProjects = filterProjectsByLanguages(selectedLangs, data.projects);
    }

    /** Called when a language chip is clicked */
    function selectLang(language: string) {
      if (selectedLangs.includes(language)) {
        selectedLangs = selectedLangs.filter(l => l !== language);
      } else {
        selectedLangs = [...selectedLangs, language];
      }
      updateProjectList();
    }
</script>

<Navbar path={[]} config={data.config} />

<Markdown source={data.config.info} />

<h2>Projects</h2>

<ChipList>
    {#each data.languages as lang (lang.slug)}
        <LanguageChip
            on:click={() => selectLang(lang.slug)}
            selected={selectedLangs.includes(lang.slug)}
            info={lang}
        />
    {/each}
</ChipList>

<div class="project-list">
    {#each selectedProjects as info (info.slug)}
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

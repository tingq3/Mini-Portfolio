<script lang="ts">
    import { flip } from "svelte/animate";
    import { fade } from 'svelte/transition';
    import LangChip from "$components/LangChip.svelte";
    import ProjectCard from "./ProjectCard.svelte";
    import Navbar from "$components/Navbar.svelte";

    export let data: import('./$types').PageData;

    let languageList = data.languages;
    // Sort languages by most commonly used
    languageList.sort((a, b) =>
        filterProjectsByLanguages([b.slug]).length
        - filterProjectsByLanguages([a.slug]).length
    )

    let selectedProjects = [...data.projects];
    let selectedLangs: string[] = [];

    function updateProjectList() {
        if (selectedLangs.length === 0) {
            selectedProjects = [...data.projects];
            return;
        }

        selectedProjects = filterProjectsByLanguages(selectedLangs);
    }

    function filterProjectsByLanguages(langs: string[]) {
        return data.projects
            .filter(
                p => p.languages.find(l => langs.includes(l))
                !==undefined
            );
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

<Navbar page="" />

<p>This is my data-driven portfolio website.</p>

<h2>Projects</h2>

<div class="lang-chips">
    {#each languageList as info (info.slug)}
        <LangChip
            on:click={() => selectLang(info.slug)}
            link={false}
            selected={selectedLangs.includes(info.slug)}
            {info}
        />
    {/each}
</div>

<div class="project-list">
    {#each selectedProjects as info (info.slug)}
    <div
        transition:fade={{ duration: 300 }}
        animate:flip={{ duration: 300 }}
    >
        <ProjectCard {info} />
    </div>
    {/each}
</div>

<style>
    .lang-chips {
        display: flex;
        gap: 5px;
    }

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

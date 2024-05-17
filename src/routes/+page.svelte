<script lang="ts">
    export let data: {
        projects: TProject[],
        languages: TLanguage[],
    };

    import type { TLanguage, TProject } from "$types";
    import LangChip from "./LangChip.svelte";
    import ProjectCard from "./ProjectCard.svelte";

</script>

<h1>Maddy Guthridge - Portfolio</h1>

<p>This is my data-driven portfolio website.</p>

<h2>Projects</h2>

<div class="lang-chips">
    {#each data.languages as info}
        <LangChip link={false} {info} />
    {/each}
</div>

<div class="project-list">
    {#each data.projects as info}
        <ProjectCard {info} />
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

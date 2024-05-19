<script lang="ts">
    import { Navbar } from '$components';
    import { LanguageCard } from '$components/card';

    export let data: import('./$types').PageData;
</script>

<Navbar path={[{ url: 'languages', txt: 'Languages' }]} config={data.config}/>

<div class="language-list">
    {#each data.languages as info (info.slug)}
    <div>
        <LanguageCard {info} />
    </div>
    {/each}
</div>

<style>
    /* https://css-tricks.com/an-auto-filling-css-grid-with-max-columns/ */
    .language-list {
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

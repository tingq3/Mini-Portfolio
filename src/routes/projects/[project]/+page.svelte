<script lang="ts">
    import Markdown from "$components/Markdown.svelte";
    import LangChip from "$components/LangChip.svelte";
    import Navbar from "$components/Navbar.svelte";

    export let data: import('./$types').PageData;
</script>

<Navbar page={data.info.name} />

<div class="lang-chips">
    {#each data.info.languages as lang}
        <LangChip info={data.languages[lang]} selected />
    {/each}
</div>

<Markdown source={data.readme} />

<style>
    .lang-chips {
        display: flex;
        gap: 10px;
    }
</style>

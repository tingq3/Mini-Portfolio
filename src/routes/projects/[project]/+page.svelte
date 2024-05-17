<script lang="ts">
    import Markdown from "$components/Markdown.svelte";
    import LangChip from "$components/LangChip.svelte";

    export let data: import('./$types').PageData;
</script>

<h1>{data.info.name}</h1>

{#each data.info.languages as lang}
    <LangChip info={data.languages[lang]} selected />
{/each}

<Markdown source={data.readme} />

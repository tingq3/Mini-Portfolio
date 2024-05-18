<script lang="ts">
    import Markdown from "$components/Markdown.svelte";
    import LangChip from "$components/LangChip.svelte";
    import Navbar from "$components/Navbar.svelte";

    export let data: import('./$types').PageData;
</script>

<Navbar path={[{ url: 'languages', txt: 'Languages' }, {url: data.info.slug, txt: data.info.name}]}/>

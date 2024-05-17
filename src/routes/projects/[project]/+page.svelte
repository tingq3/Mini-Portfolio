<script lang="ts">
    import Markdown from "../../../components/Markdown.svelte";

	/** @type {import('./$types').PageData} */
    export let data;
</script>

<h1>{data.info.name}</h1>

<Markdown source={data.readme} />

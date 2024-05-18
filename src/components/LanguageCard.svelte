<script lang="ts">
    import type { TLanguage } from "$types";
    import Card from "./Card.svelte";

    export let info: TLanguage;
</script>

<Card
    link="/languages/{info.slug}"
    title={info.name}
    description={info.description}
    color={info.color}
/>

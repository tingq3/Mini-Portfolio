<script lang="ts">
    import type { TProject } from '$types';
    import Card from './Card.svelte';

    export let info: TProject;
</script>

<Card
    link="/projects/{info.slug}"
    title={info.name}
    description={info.description}
    color={info.color}
/>

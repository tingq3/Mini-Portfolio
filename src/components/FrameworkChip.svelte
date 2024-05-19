<script lang="ts">
    import type { TFramework } from '$types';
    import Chip from './Chip.svelte';

    export let info: TFramework;
    export let link: boolean = false;
    export let selected: boolean = false;
</script>

<Chip
    on:click
    name={info.name}
    description={info.description}
    color={info.color}
    {selected}
    link={link ? `/frameworks/${info.slug}` : undefined}
/>

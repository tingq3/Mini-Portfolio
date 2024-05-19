<script lang="ts">
    import type { TLanguage } from '$types';
    import Chip from './Chip.svelte';

    export let info: TLanguage;
    export let link: boolean = false;
    export let selected: boolean = false;
</script>

<Chip
    on:click
    name={info.name}
    description={info.description}
    color={info.color}
    {selected}
    link={link ? `/languages/${info.slug}` : undefined}
/>

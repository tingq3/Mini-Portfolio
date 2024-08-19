<script lang="ts">
    import type { Label } from '$types';
    import Chip from './Chip.svelte';

    export let label: Label;
    export let link: boolean = false;
    export let selected: boolean = false;
</script>

<Chip
    on:click
    name={label.info.name}
    description={label.info.description}
    color={label.info.color}
    {selected}
    link={link ? `/${label.classifier}/${label.slug}` : undefined}
/>

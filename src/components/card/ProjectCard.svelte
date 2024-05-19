<script lang="ts">
    import type { TProject } from '$types';
    import type { TLanguageMap } from '$types/language';
    import Card from './Card.svelte';
    import { ChipList, LanguageChip } from '$components/chip';

    export let info: TProject;
    export let languages: TLanguageMap;
</script>

<Card
    link="/projects/{info.slug}"
    title={info.name}
    color={info.color}
>
    <p>{info.description}</p>
    <ChipList>
        {#each info.languages as lang}
            <LanguageChip link selected info={languages[lang]} />
        {/each}
    </ChipList>
</Card>

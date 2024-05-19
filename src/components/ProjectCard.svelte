<script lang="ts">
    import type { TProject } from '$types';
    import type { TLanguageMap } from '$types/language';
    import Card from './Card.svelte';
    import ChipList from './ChipList.svelte';
    import LangChip from './LangChip.svelte';

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
            <LangChip link selected info={languages[lang]} />
        {/each}
    </ChipList>
</Card>

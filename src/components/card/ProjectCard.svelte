<script lang="ts">
    import type { TFrameworkMap, TLanguageMap, TProject } from '$types';
    import Card from './Card.svelte';
    import { ChipList, FrameworkChip, LanguageChip } from '$components/chip';
    import { Separator } from '..';

    export let info: TProject;
    export let languages: TLanguageMap;
    export let frameworks: TFrameworkMap;
</script>

<Card
    link="/projects/{info.slug}"
    title={info.name}
    color={info.color}
>
    <p>{info.description}</p>
    <ChipList>
        <!-- Languages -->
        {#each info.languages as lang}
            <LanguageChip info={languages[lang]} selected link />
        {/each}
        <!-- Frameworks -->
        {#if info.frameworks.length}
            <!--
                FIXME: Projects with no languages will have a yucky
                separator at the start of the chip list
            -->
            <Separator />
        {/if}
        {#each info.frameworks as lang}
            <FrameworkChip info={frameworks[lang]} selected link />
        {/each}
    </ChipList>
</Card>

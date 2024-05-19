<script lang="ts">
    import Markdown from '$components/Markdown.svelte';
    import LanguageChip from '$components/LanguageChip.svelte';
    import FrameworkChip from '$components/FrameworkChip.svelte';
    import Navbar from '$components/Navbar.svelte';
    import ChipList from '$components/ChipList.svelte';
    // import AsciinemaPlayer from "$components/AsciinemaPlayer.svelte";

    export let data: import('./$types').PageData;
</script>

<Navbar
    path={[{ url: 'projects', txt: 'Projects' }, { url: data.info.slug, txt: data.info.name }]}
    config={data.config}
/>

<main>
    <div id="info-container">
        <ChipList>
            <!-- Languages -->
            {#each data.info.languages as lang}
                <LanguageChip info={data.languages[lang]} selected link />
            {/each}
            <!-- Frameworks -->
            {#each data.info.frameworks as lang}
                <FrameworkChip info={data.frameworks[lang]} selected link />
            {/each}
        </ChipList>

        <Markdown
            source={data.info.readme}
        />
    </div>
    <!--
        Asciinema seems to be broken currently:
        https://github.com/asciinema/asciinema-player/issues/259
    -->
    <!-- {#if data.info.hasDemo}
        <AsciinemaPlayer castUrl="/projects/{data.info.slug}/demo.asciinema" />
    {/if} -->
</main>

<style>
    main {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    #info-container {
        width: 80%;
        border-radius: 10px;
        box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.37);
        padding: 20px;
    }
</style>

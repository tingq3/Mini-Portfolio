<script lang="ts">
    import Markdown from '$components/Markdown.svelte';
    import LangChip from '$components/LangChip.svelte';
    import Navbar from '$components/Navbar.svelte';
    // import AsciinemaPlayer from "$components/AsciinemaPlayer.svelte";

    export let data: import('./$types').PageData;
</script>

<Navbar
    path={[{ url: 'projects', txt: 'Projects' }, { url: data.info.slug, txt: data.info.name }]}
    config={data.config}
/>

<main>
    <div id="info-container">
        <div class="lang-chips">
            {#each data.info.languages as lang}
                <LangChip info={data.languages[lang]} selected />
            {/each}
        </div>

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

    .lang-chips {
        display: flex;
        gap: 10px;
    }
</style>

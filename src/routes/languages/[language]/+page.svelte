<script lang="ts">
    import { Markdown, Navbar } from '$components';

    export let data: import('./$types').PageData;
</script>

<Navbar
    path={[{ url: 'languages', txt: 'Languages' }, { url: data.info.slug, txt: data.info.name }]}
    config={data.config}
/>

<main>
    <div id="info-container">
        <Markdown
            source={data.info.readme}
        />
    </div>
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

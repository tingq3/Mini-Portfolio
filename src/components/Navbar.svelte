<script lang="ts">
    import { dev } from "$app/environment";

    export let page: string;

    function reload() {
        fetch('/reload', { method: 'POST' })
            .then(() => location.reload())
            .catch(e => console.error("Error reloading data", e));
    }
</script>
<nav>
    <span style:grid-area="navigator">
        {#if page === ""}
            <h1>Maddy Guthridge / Portfolio</h1>
        {:else}
            <h1><a href="/">Maddy Guthridge / Portfolio</a> / {page}</h1>
        {/if}
    </span>
    {#if dev}
    <span id="dev-tools">
        <button on:click={reload}>
            Reload data
        </button>
    </span>
    {/if}
</nav>

<style>
    nav {
        display: grid;
        grid-template-columns: 1fr auto 100px;
        grid-template-areas: "navigator empty dev-tools";
    }

    a {
        color: black;
        text-decoration: none;
    }
    a:hover {
        text-decoration: underline;
    }

    h1 {
        font-size: 3em;
    }

    #dev-tools {
        display: flex;
        align-items: center;
        justify-content: center;
        grid-area: dev-tools;
    }
    #dev-tools > button {
        background-color: rgb(255, 157, 255);
        border-radius: 10px;
        border-color: rgb(214, 79, 255);
        border-style: solid;
        padding: 10px;
    }
    #dev-tools > button:hover {
        cursor: pointer;
        background-color: rgb(255, 109, 255);
    }
</style>

<script lang="ts">
    export let page: string;
</script>
<nav>
    {#if page === ""}
        <h1>Maddy Guthridge / Portfolio</h1>
    {:else}
    <h1><a href="/">Maddy Guthridge / Portfolio</a> / {page}</h1>
    {/if}
</nav>

<style>
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
</style>

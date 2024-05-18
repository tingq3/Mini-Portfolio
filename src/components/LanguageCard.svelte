<script lang="ts">
    import type { TLanguage } from "$types";

    export let info: TLanguage;
</script>

<a href="/languages/{info.slug}">
    <div>
        <h3>{info.name}</h3>
        <p>{info.description}</p>
    </div>
</a>


<style>
    a {
        color: black;
        text-decoration: none;
    }

    div {
        padding: 10px 30px;
        margin: 10px;
        background-color: rgb(253, 241, 255);
        border-radius: 15px;
        box-shadow: 5px 5px 15px rgba(61, 61, 61, 0.329);
        height: 90%;
        transition:
            background-color .5s,
            transform .5s ease-out;
    }
    div:hover {
        transform: scale(1.01);
        background-color: rgb(250, 224, 255);
    }
</style>

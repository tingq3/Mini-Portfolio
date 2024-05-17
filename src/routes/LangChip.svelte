<script lang="ts">
    import type { TLanguage } from "$types";

    export let info: TLanguage;
    export let link: boolean = true;
    export let selected: boolean = false;
</script>

<a href={link ? `/languages/${info.slug}` : undefined} on:click>
    <div
        style:--fill={selected ? info.color : "#DDD"}
        style:--hover={selected ? "brightness(0.85)" : ""}
        style:--border={info.color}
    >
        {info.name}
    </div>
</a>

<style>
    a {
        color: black;
        text-decoration: none;
    }
    div {
        background-color: var(--fill);
        border-color: var(--border);
        border-style: solid;
        border-radius: 20px;
        padding: 5px 10px;
        width: min-content;
        transition:
            filter .5s,
            background-color .5s;
    }
    div:hover {
        filter: var(--hover);
        background-color: var(--border);
        cursor: pointer;
    }
</style>

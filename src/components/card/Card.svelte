<script lang="ts">
    import Color from 'color';

    export let link: string;
    export let newTab: boolean = false;
    export let color: string;

    $: baseColor = Color(color).lightness(85).hex();
    $: hoverColor = Color(color).lightness(70).hex();
</script>

<a
    href={link}
    target={newTab ? '_blank' : undefined}
>
    <div
        class="card"
        style:--base-color={baseColor}
        style:--hover-color={hoverColor}
    >
        <div class="card-top">
            <slot name="top" />
        </div>
        <div class="card-main">
            <slot />
        </div>
        <div class="card-bottom">
            <slot name="bottom" />
        </div>
    </div>
</a>

<style>
    a {
        color: black;
        text-decoration: none;
    }

    .card {
        display: flex;
        flex-direction: column;
        padding: 10px 30px;
        margin: 10px;
        background-color: var(--base-color);
        border-radius: 15px;
        box-shadow: 5px 5px 15px rgba(61, 61, 61, 0.329);
        height: 90%;
        transition:
            background-color .5s,
            transform .5s ease-out;
    }
    .card:hover {
        transform: scale(1.01);
        background-color: var(--hover-color);
    }
    @media only screen and (max-width: 600px) {
        .card {
            max-width: 100%;
            padding: 10px 15px;
        }
    }

    .card-main {
        flex-grow: 1;
    }
</style>

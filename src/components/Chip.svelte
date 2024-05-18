<script lang="ts">
    import { tooltip } from '$lib/tooltip';
    import Color from 'color';

    /** Name to show for chip */
    export let name: string;
    /** Description to show on hover */
    export let description: string;
    /** Color to use for the chip */
    export let color: string;
    /** Location to link to if desired */
    export let link: string | undefined = undefined;
    /** Whether the chip should render as selected */
    export let selected: boolean = false;

    $: fillColor = selected ? Color(color).lightness(80).hex() : Color(color).lightness(95).hex();
    $: borderColor = selected ? Color(color).lightness(50).hex() : Color(color).lightness(85).hex();
    $: hoverColor = Color(color).lightness(70).hex();
    $: borderWidth = selected ? '2px' : '1px';
</script>

<a
    on:click
    href={link}
>
    <div
        use:tooltip={{ content: description }}
        style:--fill-color={fillColor}
        style:--border-color={borderColor}
        style:--hover-color={hoverColor}
        style:--border-width={borderWidth}
    >
        {name}
    </div>
</a>

<style>
    a {
        color: black;
        text-decoration: none;
    }
    div {
        margin: 2px;
        background-color: var(--fill-color);
        border-color: transparent;
        border-style: solid;
        border-radius: 30px;
        border-width: 2px;
        box-shadow: 0 0 0 var(--border-width) var(--border-color);
        padding: 5px 10px;
        width: min-content;
        transition:
            border-color .5s,
            background-color .5s;
    }
    div:hover {
        background-color: var(--hover-color);
        cursor: pointer;
    }
</style>

<script lang="ts">
  import { createBubbler } from 'svelte/legacy';

  const bubble = createBubbler();
  import { tooltip } from '$lib/tooltip';
  import Color from 'color';

  
  
  
  
  
  interface Props {
    /** Name to show for chip */
    name: string;
    /** Description to show on hover */
    description: string;
    /** Color to use for the chip */
    color: string;
    /** Location to link to on click (or `undefined` for no link) */
    link: string | undefined;
    /** Whether the chip should render as selected (filled) */
    selected?: boolean;
  }

  let {
    name,
    description,
    color,
    link,
    selected = false
  }: Props = $props();

  let fillColor = $derived(selected ? Color(color).lightness(80).hex() : Color(color).lightness(95).hex());
  let borderColor = $derived(selected ? Color(color).lightness(50).hex() : Color(color).lightness(85).hex());
  let hoverColor = $derived(Color(color).lightness(70).hex());
  let borderWidth = $derived(selected ? '2px' : '1px');
</script>

<a
  onclick={bubble('click')}
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
    text-wrap: nowrap;
    transition:
      border-color .5s,
      background-color .5s;
  }
  div:hover {
    background-color: var(--hover-color);
    cursor: pointer;
  }
</style>

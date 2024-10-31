<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { goto } from '$app/navigation';
  import Color from 'color';

  
  
  
  
  interface Props {
    /** Location to link to, or `false` to not give a link */
    link?: string | false;
    /** Whether to open link in new tab */
    newTab?: boolean;
    /** Color to use for the card */
    color: string;
    /** Whether the card has an icon */
    hasIcon?: boolean;
    icon?: import('svelte').Snippet;
    children?: import('svelte').Snippet;
    bottom?: import('svelte').Snippet;
  }

  let {
    link = false,
    newTab = false,
    color,
    hasIcon = false,
    icon,
    children,
    bottom
  }: Props = $props();

  const dispatch = createEventDispatcher<{
    click: undefined,
  }>();

  let baseColor = $derived(Color(color).lightness(85).hex());
  let hoverColor = $derived(Color(color).lightness(70).hex());
</script>

<a
  href={link || undefined}
  onclick={async () => {
    if (link) {
      await goto(link);
    } else {
      dispatch('click');
    }
  }}
  target={newTab ? '_blank' : undefined}
>
  <div
    class="card"
    style:--base-color={baseColor}
    style:--hover-color={hoverColor}
  >
    {#if hasIcon}
      <div class="card-grid">
        <div class="icon-div">
          {@render icon?.()}
        </div>
        <div class="card-main">
          {@render children?.()}
        </div>
      </div>
    {:else}
      <div class="card-main">
        {@render children?.()}
      </div>
    {/if}
    <div class="card-bottom">
      {@render bottom?.()}
    </div>
  </div>
</a>

<style>
  a {
    color: black;
    text-decoration: none;
  }

  .card-grid {
    display: grid;
    grid-template-columns: 1fr 3fr;
    gap: 10px;
    /* Make main content of card leave some space before the bottom slot */
    flex-grow: 1;
  }
  .card-main {
    flex-grow: 1;
  }

  /* Make icons using Line Awesome render at a nice font size */
  .icon-div {
    font-size: 3em;
  }

  .card {
    display: flex;
    flex-direction: column;
    padding: 10px;
    margin: 10px;
    background-color: var(--base-color);
    border-radius: 15px;
    box-shadow: 5px 5px 15px rgba(61, 61, 61, 0.329);
    height: 90%;
    transition:
      background-color .5s,
      box-shadow .5s;
  }
  .card:hover {
    /* Don't scale cards since that makes the text render weirdly on Firefox */
    /* transform: scale(1.01); */
    background-color: var(--hover-color);
    box-shadow:
      /* Default shadow */
      5px 5px 10px rgba(61, 61, 61, 0.178),
      /* Glow */
      0 0 20px var(--base-color);
  }
  @media only screen and (max-width: 600px) {
    .card {
      max-width: 100%;
      padding: 10px 15px;
    }
  }
</style>

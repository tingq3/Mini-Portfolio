<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { goto } from '$app/navigation';
  import Color from 'color';

  /** Location to link to, or `false` to not give a link */
  export let link: string | false = false;
  /** Whether to open link in new tab */
  export let newTab: boolean = false;
  /** Color to use for the card */
  export let color: string;
  /** Whether the card has an icon */
  export let hasIcon: boolean = false;

  const dispatch = createEventDispatcher<{
    click: void,
  }>();

  $: baseColor = Color(color).lightness(85).hex();
  $: hoverColor = Color(color).lightness(70).hex();
</script>

<a
  href={link || undefined}
  on:click={async () => {
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
          <slot name="icon" />
        </div>
        <div class="card-main">
          <slot />
        </div>
      </div>
    {:else}
      <div class="card-main">
        <slot />
      </div>
    {/if}
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

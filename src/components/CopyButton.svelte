<script lang="ts">
  import { tooltip } from '$lib/tooltip';

  export let text: string;
  export let hint: string = 'Copy';

  async function copy() {
    await navigator.clipboard.writeText(text);
  }
</script>

<button
  class="copy-btn"
  on:click|preventDefault={copy}
  use:tooltip={{ content: hint }}
>
  <slot/>
</button>

<style>
  /*
    Reset button properties
    https://stackoverflow.com/a/54101412/6335363
  */
  button {
    all: unset;
  }
  .copy-btn {
    display: flex;
    align-items: center;
    background-color: rgba(255, 255, 255, 0.5);
    padding: 2px 10px;
    cursor: pointer;
    border-radius: 5px;
    border-color: rgba(0, 0, 0, 0.178);
    border-width: 1px;
    border-style: solid;
    transition: background-color .5s;
  }
  .copy-btn:hover {
    background-color: rgba(0, 0, 0, 0.137);
  }
  .copy-btn:focus {
    border-color: rgb(0, 0, 0);
    background-color: rgba(0, 0, 0, 0.137);
  }
  .copy-btn:active {
    background-color: rgba(255, 255, 255, 0.9);
    transition: background-color 0s;
  }
</style>

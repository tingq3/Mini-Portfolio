<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let show: boolean;
  export let color = 'white';
  export let canClose = true;

  $: display = show ? 'block' : 'none';

  function close() {
    if (canClose) {
      dispatch('close', {});
    }
  }

  const dispatch = createEventDispatcher<{
    close: object,
  }>();

  const bubbleClick = (groupId: string, itemId: string, e: MouseEvent) => {

  };
</script>

<!-- svelte-ignore a11y-no-static-element-interactions a11y-click-events-have-key-events -->
<div class="outer" style="display: {display};" on:click={close}>
  <div class="inner">
    <div class="box" style="background-color: {color};" on:click|stopPropagation>
      <div class="header">
        <slot name="header"></slot>
        {#if canClose}
          <span />
          <button on:click|preventDefault={close}>
            <i class="las la-times"></i>
          </button>
        {/if}
      </div>
      <div class="main-content">
        <slot />
      </div>
    </div>
  </div>
</div>

<style>
  .outer {
    z-index: 1;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-content: center;
    background-color: rgba(0, 0, 0, 0.5);
  }

  .inner {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .box {
    width: 40%;
    border-radius: 10px;
  }

  .header {
    margin: 20px;
    display: grid;
    grid-template-columns: 1fr auto 4rem;
    grid-template-rows: 1fr;
  }

  .main-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 20px;
  }

  button {
    border: none;
    background-color: transparent;
  }
  button:hover {
    cursor: pointer;
  }
  button > i {
    font-size: 3rem;
  }
</style>

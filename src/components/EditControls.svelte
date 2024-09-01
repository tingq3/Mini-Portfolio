<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  /** Whether edit mode is currently enabled */
  export let editing: boolean;

  const dispatch = createEventDispatcher<{
    beginEdits: undefined,
    finishEdits: boolean,
  }>();
</script>

<div class="edit-buttons">
  {#if editing}
    <button on:click={() => dispatch('finishEdits', false)}>Cancel</button>
    <button on:click={() => dispatch('finishEdits', true)}>Done</button>
  {:else}
    <button on:click={() => dispatch('beginEdits')}>Edit</button>
  {/if}
</div>

<style>
  .edit-buttons {
    display: flex;
    gap: 10px;
    width: 90%;
    justify-content: right;
  }
  button {
    height: 2rem;
    background-color: rgb(221, 221, 221);
    border: none;
    border-radius: 5px;
    padding: 10px;
    display: flex;
    align-items: center;
  }
  button:hover {
    background-color: rgb(210, 210, 210);
    cursor: pointer;
  }
</style>

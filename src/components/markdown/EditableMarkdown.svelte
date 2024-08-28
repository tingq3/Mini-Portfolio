<script lang="ts">
  import Markdown from './Markdown.svelte';
  import MarkdownEditor from './MarkdownEditor.svelte';

  /** Markdown source code */
  export let source: string;
  /** Whether the editing mode should be visible */
  export let editable: boolean;

  /** Callback to save the markdown contents */
  export let onSave: (newSource: string) => Promise<any>;

  let isEditing = false;

  async function finishEditing() {
    isEditing = false;
    await onSave(source);
    // TODO: Error handling
  }
</script>

{#if !editable}
  <Markdown {source} />
{:else}
  {#if isEditing}
    <div class="edit-container">
      <button on:click={finishEditing}>Done</button>
    </div>
    <MarkdownEditor bind:source={source} on:submit={finishEditing} />
  {:else}
    <div class="edit-container">
      <button on:click={() => { isEditing = true; }}>Edit</button>
    </div>
    <Markdown {source} />
  {/if}
{/if}

<style>
  .edit-container {
    display: flex;
    flex-direction: row-reverse;
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

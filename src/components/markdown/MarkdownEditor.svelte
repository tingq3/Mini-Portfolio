<script lang="ts">
  import 'highlight.js/styles/stackoverflow-light.css';
  import Markdown from './Markdown.svelte';

  type Props = {
    source: string;
    onsubmit: () => void;
  };

  let { source = $bindable(), onsubmit }: Props = $props();

  function handleKeypress(e: KeyboardEvent) {
    if (e.ctrlKey && e.key === 'Enter') {
      onsubmit();
    }
  }
</script>

<div class="md-editor">
  <textarea class="md-input" bind:value={source} onkeypress={handleKeypress}
  ></textarea>
  <span class="md-preview">
    <Markdown {source} />
  </span>
</div>

<style>
  .md-editor {
    display: flex;
    gap: 10px;
  }

  .md-input {
    flex: 1;
    font-family: monospace;
    padding: 10px;
    border: solid grey 1px;
    border-radius: 5px;
    width: 100%;
  }

  .md-preview {
    flex: 1;
  }
</style>

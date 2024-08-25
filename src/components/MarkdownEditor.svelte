<script lang="ts">
  // import { marked } from 'marked';
  // import hljs from 'highlight.js';
  import 'highlight.js/styles/stackoverflow-light.css';
  // import { onMount } from 'svelte';
  import Markdown from './Markdown.svelte';

  export let source: string;
</script>

<div class="md-editor">
  <textarea class="md-input" bind:value={source}></textarea>
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

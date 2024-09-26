<script lang="ts">
  import Markdown from './Markdown.svelte';
  import MarkdownEditor from './MarkdownEditor.svelte';

  /** Markdown source code */
  export let source: string;
  /** Whether we are currently editing the markdown */
  export let editing: boolean;

  // const originalSource = source;
</script>

{#if editing}
  <MarkdownEditor bind:source={source} on:submit />
{:else}
  <Markdown {source} />
{/if}

<script lang="ts">
  import Markdown from './Markdown.svelte';
  import MarkdownEditor from './MarkdownEditor.svelte';

  
  
  interface Props {
    /** Markdown source code */
    source: string;
    /** Whether we are currently editing the markdown */
    editing: boolean;
  }

  let { source = $bindable(), editing }: Props = $props();

  // const originalSource = source;
</script>

{#if editing}
  <MarkdownEditor bind:source={source} on:submit />
{:else}
  <Markdown {source} />
{/if}

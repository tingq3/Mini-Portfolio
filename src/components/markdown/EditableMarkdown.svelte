<script lang="ts">
  import Markdown from './Markdown.svelte';
  import MarkdownEditor from './MarkdownEditor.svelte';

  type Props = {
    /** Markdown source code */
    source: string;
    /** Whether we are currently editing the markdown */
    editing: boolean;
    onsubmit: () => void;
  };

  let { source = $bindable(), editing, onsubmit }: Props = $props();
</script>

{#if editing}
  <MarkdownEditor bind:source {onsubmit} />
{:else}
  <Markdown {source} />
{/if}

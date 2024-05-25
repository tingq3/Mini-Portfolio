<script lang="ts">
import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/default.css';
import { onMount } from 'svelte';

export let source: string;

// https://github.com/markedjs/marked/discussions/2982#discussioncomment-6979586
const renderer = {
  link(href: string, title: string | null | undefined, text: string) {
    const link = marked.Renderer.prototype.link.call(this, href, title, text);
    return link.replace('<a', "<a target='_blank' rel='noreferrer' ");
  }
};
marked.use({ renderer });

onMount(() => {
  hljs.highlightAll();
});
</script>

<div class="markdown-render">
  <!--
    We only render markdown specifically from the `data/` directory, so
    this is safe.
  -->
  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  {@html marked(source)}
</div>

<style>
  .markdown-render :global(p > code), .markdown-render :global(pre) {
    background-color: rgb(245, 245, 245);
    padding: 2px 5px;
    border-radius: 3px;
    border-color: rgb(231, 231, 231);
    border-style: solid;
    border-width: 1px;
    /* Kinda bold but not obnoxiously so */
    font-weight: 600;
  }

  .markdown-render :global(a) {
    text-decoration: none;
  }
  .markdown-render :global(a):hover {
    text-decoration: underline;
  }
</style>

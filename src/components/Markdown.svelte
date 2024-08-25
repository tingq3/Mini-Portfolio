<script lang="ts">
  import { marked } from 'marked';
  import hljs from 'highlight.js';
  import 'highlight.js/styles/stackoverflow-light.css';
  // import { onMount } from 'svelte';

  export let source: string;

  // https://github.com/markedjs/marked/discussions/2982#discussioncomment-6979586
  const renderer = {
    link(href: string, title: string | null | undefined, text: string) {
      const link = marked.Renderer.prototype.link.call(this, href, title, text);
      return link.replace('<a', "<a target='_blank' rel='noreferrer' ");
    }
  };
  marked.use({ renderer });

  let markdownRender: HTMLDivElement;

  $: rendered = marked(source);

  // https://stackoverflow.com/a/75688200/6335363
  $: rendered && markdownRender && applySyntaxHighlighting(markdownRender);

  function applySyntaxHighlighting(renderElement: HTMLDivElement) {
    // Wait a moment before we highlight so that we can be sure the HTML has
    // updated
    // This is honestly pretty gross but I haven't been able to find a better
    // way, since the contents of the div change after the call to this
    // function when we just subscribe to what their contents are supposed to
    // be
    setTimeout(() => {
      renderElement.querySelectorAll('pre code').forEach((el) => {
        hljs.highlightElement(el as HTMLElement);
      });
    });
  }
</script>

<div class="markdown-render" bind:this={markdownRender}>
  <!--
    We only render markdown specifically from the `data/` directory, so
    this is safe.
  -->
  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  {@html rendered}
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
  /* Override the background colour from code highlighting */
  .markdown-render :global(code) {
    background-color: rgb(245, 245, 245);
  }

  .markdown-render :global(pre > code) {
    padding: 1em;
  }

  .markdown-render :global(a) {
    text-decoration: none;
  }
  .markdown-render :global(a):hover {
    text-decoration: underline;
  }
</style>

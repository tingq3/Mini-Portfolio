<script lang="ts">
    export let source: string;

    import { marked } from 'marked';
    // https://github.com/markedjs/marked/discussions/2982#discussioncomment-6979586
    const renderer = {
      link(href: string, title: string | null | undefined, text: string) {
        const link = marked.Renderer.prototype.link.call(this, href, title, text);
        return link.replace('<a', "<a target='_blank' rel='noreferrer' ");
      }
    };
    marked.use({ renderer });
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
    .markdown-render :global(code) {
        background-color: rgb(245, 245, 245);
        padding: 2px 5px;
        border-radius: 3px;
        border-color: rgb(231, 231, 231);
        border-style: solid;
        border-width: 1px;
        font-weight: bold;
    }

    .markdown-render :global(a) {
        text-decoration: none;
    }
    .markdown-render :global(a):hover {
        text-decoration: underline;
    }
</style>

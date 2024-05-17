<script lang="ts">
    export let source: string;

    import { marked } from "marked";
</script>

<div class="markdown-render">
    {@html marked(source)}
</div>

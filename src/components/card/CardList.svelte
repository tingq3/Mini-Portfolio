<script>
  /**
   * @typedef {Object} Props
   * @property {import('svelte').Snippet} [children]
   */

  /** @type {Props} */
  let { children } = $props();
</script>

<div class="card-list">
  {@render children?.()}
</div>

<style>
  .card-list {
    display: flex;
    gap: 10px;
    width: 100%;
    justify-content: center;
  }
</style>

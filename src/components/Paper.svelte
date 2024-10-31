<script lang="ts">
  interface Props {
    opacity?: number;
    children?: import('svelte').Snippet;
  }

  let { opacity = 0.75, children }: Props = $props();
</script>

<div class="paper" style="--opacity: {opacity}">
  {@render children?.()}
</div>

<style>
  .paper {
    width: 80%;
    border-radius: 10px;
    box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.37);
    background-color: rgba(255, 255, 255, var(--opacity));
  }
  @media only screen and (max-width: 600px) {
    .paper {
      width: 95%;
    }
  }
</style>

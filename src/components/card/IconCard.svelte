<script lang="ts">
  import { Card } from '.';

  interface Props {
    title: string;
    link?: string | false;
    color: string;
    icon?: import('svelte').Snippet;
  }

  let {
    title,
    link = false,
    color,
    icon
  }: Props = $props();
</script>

<Card
  {link}
  newTab={true}
  {color}
  on:click
>
  <span>
    <div class="icon-div">
      {@render icon?.()}
    </div>
    <h3>{title}</h3>
  </span>
</Card>

<style>
  span {
    display: flex;
    gap: 10px;
    align-items: center;
    height: 100%;
  }

  .icon-div {
    font-size: 3em;
  }
</style>

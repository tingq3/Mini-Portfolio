<script lang="ts">
  import { Card } from '.';

  export let title: string;
  export let link: string | false = false;
  export let color: string;
</script>

<Card
  {link}
  newTab={true}
  {color}
  on:click
>
  <span>
    <div class="icon-div">
      <slot name="icon" />
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

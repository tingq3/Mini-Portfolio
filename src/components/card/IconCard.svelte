<script lang="ts">
    import { Card } from '.';

  export let title: string;
  export let link: string;
  export let color: string;
</script>

<Card
  {link}
  newTab={true}
  {color}
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
  }

  .icon-div {
    font-size: 3em;
  }
</style>

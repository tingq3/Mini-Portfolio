<script lang="ts">
  import { type PortfolioGlobals } from '$lib';
  import Card from './Card.svelte';

  export let globals: PortfolioGlobals;
  export let groupId: string;

  $: group = globals.groups[groupId];
</script>

<Card
  link="/{groupId}"
  color={group.info.color}
>

  {#if group.info.icon}
    <div class="card-grid">
      <img
        src="/{groupId}/{group.info.icon}"
        alt="Icon for {group.info.name}"
        class="label-icon"
      />
      <div>
        <h3>{group.info.name}</h3>
        <p>{group.info.description}</p>
      </div>
    </div>
  {:else}
    <div class="card-no-icon">
      <h3>{group.info.name}</h3>
      <p>{group.info.description}</p>
    </div>
  {/if}
</Card>

<style>
  h3 {
    margin-bottom: 0;
  }

  .card-grid {
    display: grid;
    grid-template-columns: 1fr 3fr;
    gap: 10px;
  }

  .label-icon {
    width: 100%;
    border-radius: 15px;
  }

  .card-no-icon {
    margin: 0 20px;
  }
</style>

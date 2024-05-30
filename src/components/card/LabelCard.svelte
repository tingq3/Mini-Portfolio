<script lang="ts">
    import { type PortfolioGlobals, type Label, type ClassifierSlug, type LabelSlug } from '$types';
    import Card from './Card.svelte';
    import { ChipList } from '$components/chip';
    import { getAssociatedLabels } from '$lib/util';

    export let label: Label;
    export let globals: PortfolioGlobals;

    // List of associated labels, grouped by classifier
    $: associatedLabels = getAssociatedLabels(globals, label);
</script>

<Card
  link="/{label.classifier}/{label.slug}"
  color={label.info.color}
>

  {#if label.info.icon}
    <div class="card-grid">
      <img
        src="/{label.classifier}/{label.slug}/{label.info.icon}"
        alt="Icon for {label.info.name}"
        class="label-icon"
      />
      <div>
        <h3>{label.info.name}</h3>
        <p>{label.info.description}</p>
      </div>
    </div>
  {:else}
    <div class="card-no-icon">
      <h3>{label.info.name}</h3>
      <p>{label.info.description}</p>
    </div>
  {/if}
  <ChipList slot="bottom" labels={associatedLabels} link={true} />
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

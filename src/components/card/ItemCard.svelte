<script lang="ts">
  import { type PortfolioGlobals } from '$lib';
  import Card from './Card.svelte';
  import { ItemChipList } from '$components/chip';

  type Props = {
    globals: PortfolioGlobals;
    /** Group ID of group to show */
    groupId: string;
    /** Item ID of item to show */
    itemId: string;
    /** Whether edit mode is active */
    editing: boolean;
    /** Callback for when the element is clicked */
    onclick?: (e: MouseEvent | undefined | null) => void;
  };

  let { globals, groupId, itemId, editing, onclick }: Props = $props();

  let item = $derived(globals.items[groupId][itemId]);
  let associatedChips = $derived(
    item.info.links
      .filter(([{ style }]) => style === 'chip')
      .map(([{ groupId }, items]) =>
        items.map((itemId) => ({ groupId, itemId, selected: false })),
      ),
  );
</script>

<Card
  link={editing ? undefined : { url: `/${groupId}/${itemId}`, newTab: false }}
  color={item.info.color}
  {onclick}
>
  <div class="card-outer">
    <div class:card-icon={item.info.icon} class:flex-grow={true}>
      {#if item.info.icon}
        <img
          src="/{groupId}/{itemId}/{item.info.icon}"
          alt="Icon for {item.info.name}"
          class="label-icon"
        />
      {/if}
      <div>
        <h3>{item.info.name}</h3>
        <p>{item.info.description}</p>
      </div>
    </div>
    {#if !editing}
      <div>
        <ItemChipList
          items={associatedChips}
          {globals}
          link
          onclick={() => {}}
          onfilter={() => {}}
        />
      </div>
    {/if}
  </div>
</Card>

<style>
  h3 {
    margin-bottom: 0;
  }

  .card-outer {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .flex-grow {
    flex: 1;
  }

  .card-icon {
    display: grid;
    grid-template-columns: 1fr 3fr;
    gap: 10px;
    margin-bottom: 10px;
  }

  .label-icon {
    width: 100%;
    border-radius: 15px;
  }
</style>

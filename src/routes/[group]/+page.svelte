<script lang="ts">
  // FIXME: Remove `run` blocks when unifying group and item types
  import { run } from 'svelte/legacy';

  import { Navbar } from '$components';
  import EditableMarkdown from '$components/markdown';
  import { ItemCardGrid } from '$components/card';
  import Background from '$components/Background.svelte';
  import api from '$endpoints';
  import { ItemChipList, GroupChip } from '$components/chip';
  import {
    createItemFilter,
    applyFiltersToGroupItems,
    type FilterOptions,
  } from '$lib/itemFilter';
  import consts from '$lib/consts';
  import { generateKeywords } from '$lib/seo';
  import EditControls from '$components/EditControls.svelte';

  type Props = {
    data: import('./$types').PageData;
  };

  let { data }: Props = $props();

  let groupData = $state(data.globals.groups[data.groupId]);
  let filterSelections = $state(createItemFilter(data.globals, data.groupId));

  // Items in group
  // ==================================================

  const listHiddenItems = (groupId: string) =>
    Object.keys(data.globals.items[groupId]).filter(
      (g) => !groupData.info.listedItems.includes(g),
    );

  let editing = $state(false);
  let readme = $state('');

  let shownItems: string[] = $state([]);
  let hiddenItems = $state(listHiddenItems(data.groupId));

  /** By default list all items until a filter is applied */
  let mainItemsList: string[] = $state([]);

  // Filter groups for this group
  // ==================================================

  let filterGroups: [string, boolean][] = $state([]);

  function beginEditing() {
    editing = true;
    filterSelections = createItemFilter(data.globals, data.groupId);
    // Make mainItemsList a reference so that updates are shown to the user
    mainItemsList = shownItems;
    // Set up filter groups
    filterGroups = groupData.info.filterGroups.map((g) => [g, true]);
    // Including filter groups not shown
    Object.keys(data.globals.groups).forEach((g) => {
      if (g !== data.groupId && !groupData.info.filterGroups.includes(g)) {
        filterGroups.push([g, false]);
      }
    });
  }

  /** Callback for when editing is finished */
  async function finishEditing(save: boolean) {
    if (save) {
      // Update readme
      console.log(readme);
      groupData.readme = readme;
      await api().group.withId(data.groupId).readme.set(readme);
      groupData.info.listedItems = [...shownItems];
      groupData.info.filterGroups = filterGroups
        .filter(([, selected]) => selected)
        .map(([g]) => g);
      await api().group.withId(data.groupId).info.set(groupData.info);
    }
    // Load changes from scratch
    setupData(data.groupId);
    editing = false;
  }

  function setupData(groupId: string) {
    groupData = data.globals.groups[groupId];
    filterSelections = createItemFilter(data.globals, groupId);
    shownItems = [...groupData.info.listedItems];
    hiddenItems = listHiddenItems(groupId);
    mainItemsList = shownItems;
    readme = groupData.readme;
    editing = false;
  }

  function updateMainItemsList(filters: FilterOptions, shownItems: string[]) {
    // Only act when editing isn't in progress
    if (editing) {
      mainItemsList = shownItems;
    } else {
      mainItemsList = applyFiltersToGroupItems(
        data.globals,
        data.groupId,
        filters,
      );
    }
  }

  // Reset data when the group ID changes
  run(() => {
    setupData(data.groupId);
  });
  run(() => {
    updateMainItemsList(filterSelections, shownItems);
  });
</script>

<!-- TODO: Find a less repetitive way to get SEO tags working nicely -->
<svelte:head>
  <title>{groupData.info.name} - {data.globals.config.siteShortName}</title>
  <meta name="description" content={groupData.info.pageDescription} />
  <meta name="generator" content={consts.APP_NAME} />
  <meta
    name="keywords"
    content={generateKeywords(data.globals, data.groupId)}
  />
  <meta name="theme-color" content={groupData.info.color} />
</svelte:head>

<Background color={groupData.info.color} />

<Navbar
  path={[{ url: data.groupId, txt: groupData.info.name }]}
  config={data.globals.config}
  loggedIn={data.loggedIn}
/>

<main>
  <EditControls
    {editing}
    loggedIn={data.loggedIn}
    onbegin={beginEditing}
    onfinish={finishEditing}
  />
  <div id="readme">
    <div id="info-container">
      <EditableMarkdown
        bind:source={readme}
        {editing}
        onsubmit={() => finishEditing(true)}
      />
    </div>
  </div>

  <!-- Filtering of items -->
  {#if !editing}
    <div id="filters">
      <ItemChipList
        globals={data.globals}
        items={filterSelections}
        on:filter={(e) => {
          filterSelections = e.detail;
        }}
      />
    </div>
  {:else}
    <div class="filter-group-selection">
      <h3>Groups used for filtering</h3>
      {#each filterGroups as [filterGroup, selected]}
        <GroupChip
          globals={data.globals}
          groupId={filterGroup}
          {selected}
          onclick={() => {
            // Toggle filtering for this group
            const g = filterGroups.find(([g]) => g === filterGroup);
            if (g) {
              g[1] = !selected;
            }
            filterGroups = [...filterGroups];
          }}
        />
      {/each}
    </div>
  {/if}

  <!-- List all entry cards -->
  <div class="item-list">
    <ItemCardGrid
      groupId={data.groupId}
      itemIds={mainItemsList}
      globals={data.globals}
      {editing}
      createOption
      onclick={(groupId, itemId) => {
        if (editing) {
          shownItems = shownItems.filter((i) => i !== itemId);
          hiddenItems = [...hiddenItems, itemId];
        }
      }}
    />
  </div>
  {#if editing}
    <div class="item-list">
      <h2>Hidden items</h2>
      <ItemCardGrid
        groupId={data.groupId}
        itemIds={hiddenItems}
        globals={data.globals}
        {editing}
        onclick={(groupId, itemId) => {
          shownItems = [...shownItems, itemId];
          hiddenItems = hiddenItems.filter((i) => i !== itemId);
        }}
      />
    </div>
  {/if}
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }
  #readme {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  #info-container {
    padding: 20px;
    width: 90%;
  }
  #filters {
    width: 100%;
  }
  .filter-group-selection {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 98%;
  }
  .item-list {
    width: 100%;
  }
  .item-list > h2 {
    margin: 20px;
    margin-top: 50px;
  }
</style>

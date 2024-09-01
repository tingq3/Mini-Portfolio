<script lang="ts">
  import { Navbar } from '$components';
  import EditableMarkdown from '$components/markdown';
  import { ItemCardGrid } from '$components/card';
  import Background from '$components/Background.svelte';
  import api from '$endpoints';
  import { ItemChipList } from '$components/chip';
  import { createItemFilter, applyFiltersToGroupItems, type FilterOptions } from '$lib/itemFilter';
  import consts from '$lib/consts';
  import { generateKeywords } from '$lib/seo';
  import EditControls from '$components/EditControls.svelte';

  export let data: import('./$types').PageData;

  let groupData = data.globals.groups[data.groupId];
  let filterSelections = createItemFilter(data.globals, data.groupId);

  const listHiddenItems = (groupId: string) => Object.keys(data.globals.items[groupId])
    .filter(g => !groupData.info.listedItems.includes(g));

  let editing = false;
  let readme = groupData.readme;

  let shownItems = [...groupData.info.listedItems];
  let hiddenItems = listHiddenItems(data.groupId);

  /** By default list all items until a filter is applied */
  let mainItemsList = shownItems;

  function beginEditing() {
    editing = true;
    filterSelections = createItemFilter(data.globals, data.groupId);
    // Make mainItemsList a reference so that updates are shown to the user
    mainItemsList = shownItems;
  }

  /** Callback for when editing is finished */
  async function finishEditing(save: boolean) {
    if (save) {
      // Update readme
      groupData.readme = readme;
      await api().group.withId(data.groupId).readme.set(readme);
      groupData.info.listedItems = [...shownItems];
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
      mainItemsList = applyFiltersToGroupItems(data.globals, data.groupId, filters);
    }
  }

  // Reset data when the group ID changes
  $: setupData(data.groupId);
  $: updateMainItemsList(filterSelections, shownItems);
</script>

<!-- TODO: Find a less repetitive way to get this working nicely -->
<svelte:head>
  <title>{groupData.info.name} - {data.globals.config.siteShortName}</title>
  <meta name="description" content="{groupData.info.pageDescription}">
  <meta name="generator" content="{consts.APP_NAME}">
  <meta name="keywords" content="{generateKeywords(data.globals, data.groupId)}">
  <meta name="theme-color" content="{groupData.info.color}">
</svelte:head>

<Background color={groupData.info.color} />

<Navbar
  path={[{ url: data.groupId, txt: groupData.info.name }]}
  config={data.globals.config}
  loggedIn={data.loggedIn}
  createGroupButton
  createItemButtonGroup={data.groupId}
/>

<main>
  <EditControls
    {editing}
    on:beginEdits={beginEditing}
    on:finishEdits={e => finishEditing(e.detail)}
  />
  <div id="readme">
    <div id="info-container">
      <EditableMarkdown
        source={groupData.readme}
        editing={editing}
      />
    </div>
  </div>

  <!-- Filtering of items -->
  {#if !editing}
    <div id="filters">
      <ItemChipList
        globals={data.globals}
        items={filterSelections}
        on:filter={e => { filterSelections = e.detail; }}
      />
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
      on:click={e => {
        if (editing) {
          shownItems = shownItems.filter(i => i !== e.detail.itemId);
          hiddenItems = [...hiddenItems, e.detail.itemId];
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
        on:click={e => {
          shownItems = [...shownItems, e.detail.itemId];
          hiddenItems = hiddenItems.filter(i => i !== e.detail.itemId);
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
  .item-list {
    width: 100%;
  }
  .item-list > h2 {
    margin: 20px;
    margin-top: 50px;
  }
</style>

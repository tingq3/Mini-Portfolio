<script lang="ts">
  import { Navbar } from '$components';
  import EditableMarkdown from '$components/markdown';
  import { ItemCardGrid } from '$components/card';
  import Background from '$components/Background.svelte';
  import api from '$endpoints';
  import { ItemChipList } from '$components/chip';
  import { createItemFilter, applyFiltersToGroupItems } from '$lib/itemFilter';
    import consts from '$lib/consts';
    import { generateKeywords } from '$lib/seo';

  export let data: import('./$types').PageData;

  $: groupData = data.globals.groups[data.groupId];
  $: filterSelections = createItemFilter(data.globals, data.groupId);

  /** By default list all items until a filter is applied */
  $: itemsToList = applyFiltersToGroupItems(
    data.globals,
    data.groupId,
    filterSelections,
  );
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
  <div id="readme">
    <div id="info-container">
      <EditableMarkdown
        source={groupData.readme}
        editable={data.loggedIn}
        onSave={text => api().group.withId(data.groupId).readme.set(text)}
      />
    </div>
  </div>

  <!-- TODO: Implement filtering -->
   <div id="filters">
     <ItemChipList
      globals={data.globals}
      items={filterSelections}
      on:filter={e => { filterSelections = e.detail; }}
    />
   </div>

  <!-- List all entry cards -->
  <div id="item-list">
    <ItemCardGrid
      groupId={data.groupId}
      itemIds={itemsToList}
      globals={data.globals}
    />
  </div>
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
  #item-list {
    width: 100%;
  }
</style>

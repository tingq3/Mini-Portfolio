<script lang="ts">
  import { Navbar } from '$components';
  import Background from '$components/Background.svelte';
  import { GroupCardGrid } from '$components/card';
  import EditControls from '$components/EditControls.svelte';
  import EditableMarkdown from '$components/markdown';
  import api from '$endpoints';
  import consts from '$lib/consts';
  import { generateKeywords } from '$lib/seo';

  export let data: import('./$types').PageData;

  let editing = false;
  let readme = data.globals.readme;

  const listHiddenGroups = () => Object.keys(data.globals.groups)
    .filter(g => !data.globals.config.listedGroups.includes(g));

  /** Groups that are shown */
  let listedGroups = data.globals.config.listedGroups;
  /** Groups that are hidden */
  let hiddenGroups = listHiddenGroups();

  /** Callback for when editing is finished */
  export async function finishEditing(save: boolean) {
    if (save) {
      // Update readme
      data.globals.readme = readme;
      await api().readme.set(readme);
      data.globals.config.listedGroups = listedGroups;
      await api().admin.config.put(data.globals.config);
    } else {
      // Discard readme changes
      readme = data.globals.readme;
      // Group listing/ordering
      listedGroups = data.globals.config.listedGroups;
      hiddenGroups = listHiddenGroups();
    }
    editing = false;
  }

</script>

<svelte:head>
  <title>{data.globals.config.siteName}</title>
  <meta name="description" content="{data.globals.config.siteDescription}">
  <meta name="generator" content="{consts.APP_NAME}">
  <meta name="keywords" content="{generateKeywords(data.globals)}">
  <meta name="theme-color" content="{data.globals.config.color}">
</svelte:head>

<Navbar
  path={[]}
  config={data.globals.config}
  loggedIn={data.loggedIn}
  createGroupButton
/>

<Background color={data.globals.config.color} />

<main>
  <EditControls
    {editing}
    on:beginEdits={() => { editing = true; }}
    on:finishEdits={e => finishEditing(e.detail)}
  />

  <div id="readme">
    <div id="info-container">
      <EditableMarkdown
        {editing}
        bind:source={readme}
        on:submit={() => finishEditing(true)}
      />
    </div>
  </div>

  <!-- List all entry cards -->
  <div class="group-list">
    <GroupCardGrid
      globals={data.globals}
      groups={listedGroups}
      {editing}
      on:click={e => {
        if (editing) {
          listedGroups = listedGroups.filter(g => g !== e.detail.groupId);
          hiddenGroups = [...hiddenGroups, e.detail.groupId];
        }
      }}
    />
  </div>
  {#if editing}
  <div class="group-list">
    <h2>Hidden groups</h2>
    <GroupCardGrid
      globals={data.globals}
      groups={hiddenGroups}
      {editing}
      on:click={e => {
        listedGroups = [...listedGroups, e.detail.groupId];
        hiddenGroups = hiddenGroups.filter(g => g !== e.detail.groupId);
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
  /* #filters {
    width: 100%;
  } */
  .group-list {
    width: 100%;
  }
  .group-list > h2 {
    margin: 20px;
    margin-top: 50px;
  }
</style>

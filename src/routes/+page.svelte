<script lang="ts">
  import { Navbar } from '$components';
  import Background from '$components/Background.svelte';
  import { GroupCardGrid } from '$components/card';
  import EditControls from '$components/EditControls.svelte';
  import EditableMarkdown from '$components/markdown';
  import api from '$endpoints';
  import consts from '$lib/consts';
  import { generateKeywords } from '$lib/seo';
  import type { ConfigJson } from '$lib/server/data/config';

  type Props = {
    data: import('./$types').PageData;
  };

  let { data = $bindable() }: Props = $props();

  const listHiddenGroups = (config: ConfigJson) =>
    Object.keys(data.globals.groups).filter(
      (g) => !config.listedGroups.includes(g),
    );

  let editing: boolean = $state(false);
  let readme: string = $state(data.globals.readme);
  let configEdit: ConfigJson = $state(structuredClone(data.globals.config));
  let siteKeywords: string = $state('');

  /** Groups that are shown */
  let listedGroups: string[] = $state([]);
  /** Groups that are hidden */
  let hiddenGroups: string[] = $state([]);

  function setupData() {
    editing = false;
    readme = data.globals.readme;
    configEdit = structuredClone(data.globals.config);
    siteKeywords = configEdit.siteKeywords.join('\n');
    listedGroups = configEdit.listedGroups;
    hiddenGroups = listHiddenGroups(configEdit);
  }

  /** Callback for when editing is finished */
  async function finishEditing(save: boolean) {
    if (save) {
      // Update readme
      data.globals.readme = readme;
      await api().readme.set(readme);
      configEdit.listedGroups = listedGroups;
      // NOTE: Currently it is possible to completely mess up the keywords by including
      // a ',' character -- probably a good idea to make the API break those
      configEdit.siteKeywords = siteKeywords
        .split('\n')
        .filter((k) => k.length);
      data.globals.config = structuredClone(configEdit);
      await api().admin.config.put(data.globals.config);
    }
    // Discard changes and reload data
    setupData();
  }

  setupData();
</script>

<svelte:head>
  <title>{data.globals.config.siteName}</title>
  <meta name="description" content={data.globals.config.siteDescription} />
  <meta name="generator" content={consts.APP_NAME} />
  <meta name="keywords" content={generateKeywords(data.globals)} />
  <meta name="theme-color" content={data.globals.config.color} />
</svelte:head>

<Navbar path={[]} config={data.globals.config} loggedIn={data.loggedIn} />

<Background color={data.globals.config.color} />

<main>
  <EditControls
    {editing}
    loggedIn={data.loggedIn}
    onbegin={() => {
      editing = true;
    }}
    onfinish={finishEditing}
  />

  {#if editing}
    <form
      onsubmit={(e) => {
        e.preventDefault();
        void finishEditing(true);
      }}
    >
      <h2>Site name</h2>
      <input
        type="text"
        placeholder="My portfolio"
        bind:value={configEdit.siteName}
        required
      />
      <p>
        This is the name of your portfolio site. It is shown on the home page of
        your portfolio.
      </p>
      <h2>Site short name</h2>
      <input
        type="text"
        placeholder="Portfolio"
        bind:value={configEdit.siteShortName}
        required
      />
      <p>
        This is the short name of your portfolio site. It is shown on most pages
        within your portfolio.
      </p>
      <h2>Site description</h2>
      <input
        type="text"
        placeholder="My portfolio website"
        bind:value={configEdit.siteDescription}
      />
      <p>This is the description of your portfolio shown to search engines.</p>
      <h2>Site keywords</h2>
      <textarea placeholder="Portfolio" bind:value={siteKeywords}></textarea>
      <p>
        These are the keywords for your portfolio shown to search engines. Place
        each keyword on a new line.
      </p>
      <h2>Theme color</h2>
      <input type="color" bind:value={configEdit.color} required />
      <p>
        This is the main theme color for your portfolio site. It is subtly shown
        in the background on many pages.
      </p>
    </form>
  {/if}

  <div id="readme">
    <div id="info-container">
      <EditableMarkdown
        {editing}
        bind:source={readme}
        onsubmit={() => finishEditing(true)}
      />
    </div>
  </div>

  <!-- List all entry cards -->
  <div class="group-list">
    <GroupCardGrid
      globals={data.globals}
      groups={listedGroups}
      createOption
      {editing}
      onclick={(groupId) => {
        if (editing) {
          listedGroups = listedGroups.filter((g) => g !== groupId);
          hiddenGroups = [...hiddenGroups, groupId];
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
        onclick={(groupId) => {
          listedGroups = [...listedGroups, groupId];
          hiddenGroups = hiddenGroups.filter((g) => g !== groupId);
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
  form {
    width: 90%;
  }
  input[type='text'] {
    width: 50%;
    height: 1.5rem;
  }
  textarea {
    width: 50%;
    height: 5rem;
    resize: vertical;
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

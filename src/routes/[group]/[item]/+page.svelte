<script lang="ts">
  import { Navbar } from '$components';
  import { IconCard, RepoCard, PackageCard, CardList, ItemCardGrid } from '$components/card';
  import { ItemChipList } from '$components/chip';
  import Background from '$components/Background.svelte';
  import Paper from '$components/Paper.svelte';
  import EditableMarkdown from '$components/markdown';
  import api from '$endpoints';
  // import AsciinemaPlayer from "$components";

  export let data: import('./$types').PageData;

  $: groupData = data.globals.groups[data.groupId];
  $: itemData = data.globals.items[data.groupId][data.itemId];
</script>

<Background color={itemData.info.color}></Background>

<Navbar
  path={[
    { url: data.groupId, txt: groupData.info.name },
    { url: data.itemId, txt: itemData.info.name },
  ]}
  config={data.globals.config}
  loggedIn={data.loggedIn}
  createGroupButton
  createItemButtonGroup={data.groupId}
/>

<main>
  <Paper>
    {#if itemData.info.banner}
      <img
        src="/{data.groupId}/{data.itemId}/{itemData.info.banner}"
        alt="Banner for {itemData.info.name}"
        class="banner-image"
      />
    {/if}
    <div id="info-container">
      <EditableMarkdown
        source={itemData.readme}
        editable={data.loggedIn}
        onSave={text => api().group.withId(data.groupId).item.withId(data.itemId).readme.set(text)}
      />
      <!-- Display linked items as chips -->
      <div id="chip-links">
        {#each itemData.info.links.filter(([l]) => l.style === 'chip') as [linkOptions, linkedItems]}
          <div class="chip-link-row">
            <h2>{linkOptions.title}</h2>
            <ItemChipList
              globals={data.globals}
              items={[linkedItems.map(i => ({ groupId: linkOptions.groupId, itemId: i, selected: false }))]}
              link={true}
            />
          </div>
        {/each}
      </div>
    </div>
  </Paper>

  <!-- Display URLs if needed -->
  <div id="urls-list">
    <CardList>
      {#if itemData.info.urls.site}
        <IconCard
          title="Visit the website"
          link={itemData.info.urls.site}
          color={itemData.info.color}
        >
        <i slot="icon" class="las la-globe"></i>
        </IconCard>
      {/if}
      {#if itemData.info.urls.docs}
        <IconCard
          title="View the documentation"
          link={itemData.info.urls.docs}
          color={itemData.info.color}
        >
          <i slot="icon" class="lab la-readme"></i>
        </IconCard>
      {/if}
      {#if itemData.info.urls.repo}
        <RepoCard
          repo={itemData.info.urls.repo}
          color={itemData.info.color}
        />
      {/if}
      {#if itemData.info.package}
        <PackageCard
          info={itemData.info.package}
          color={itemData.info.color}
        />
      {/if}
    </CardList>
  </div>

  <!--
      Asciinema seems to be broken currently:
      https://github.com/asciinema/asciinema-player/issues/259
  -->
  <!-- {#if label.hasDemo}
    <AsciinemaPlayer castUrl="/projects/{label.slug}/demo.asciinema" />
  {/if} -->

  <!-- Display linked items as cards -->
  <div id="card-links">
    {#each itemData.info.links.filter(([l]) => l.style === 'card') as [linkOptions, linkedItems]}
    <h2>{linkOptions.title}</h2>
      <ItemCardGrid
        globals={data.globals}
        groupId={linkOptions.groupId}
        itemIds={linkedItems}
      />
    {/each}
  </div>
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  #info-container {
    padding: 20px;
  }

  .banner-image {
    width: 100%;
    border-radius: 10px 10px 0 0;
  }

  .chip-link-row {
    display: flex;
    align-items: baseline;
    gap: 5px;
    margin: 10px 0;
  }
  .chip-link-row > h2 {
    margin: 0;
    height: min-content;
  }

  #urls-list {
    width: 80%;
  }

  #card-links {
    width: 80%;
  }
</style>

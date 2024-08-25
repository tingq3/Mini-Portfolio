<script lang="ts">
  import { Navbar, Markdown } from '$components';
  import { IconCard, RepoCard, PackageCard, CardList } from '$components/card';
  import Background from '$components/Background.svelte';
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
  globals={data.globals}
/>

<main>
  <div class="paper">
    {#if itemData.info.banner}
      <img
        src="/{data.itemId}/{data.groupId}/{itemData.info.banner}"
        alt="Banner for {itemData.info.name}"
        class="banner-image"
      />
    {/if}
    <div id="info-container">
      <Markdown source={itemData.readme} />
      <!-- TODO: Display linked items as chips -->
    </div>
  </div>

  <!-- Display URLs if needed -->
  <div id="links-list">
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

  <!-- TODO: Display linked items as cards -->
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .paper {
    width: 80%;
    border-radius: 10px;
    box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.37);
    background-color: rgba(255, 255, 255, 0.75);
  }
  @media only screen and (max-width: 600px) {
    .paper {
      width: 95%;
    }
  }

  #info-container {
    padding: 20px;
  }

  .banner-image {
    width: 100%;
    border-radius: 10px 10px 0 0;
  }

  /* .association-chip-row {
    display: flex;
    align-items: baseline;
    gap: 5px;
    margin: 10px 0;
  }
  .association-chip-row > h3 {
    margin: 0;
    height: min-content;
  } */

  #links-list {
    width: 80%;
  }

  /* #association-cards {
    width: 80%;
  } */
</style>

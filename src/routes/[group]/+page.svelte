<script lang="ts">
  import { Navbar, Markdown } from '$components';
  import { ItemCardGrid } from '$components/card';
  import Background from '$components/Background.svelte';

  export let data: import('./$types').PageData;

  $: groupData = data.globals.groups[data.groupId];
</script>

<Background color={groupData.info.color} />

<Navbar
  path={[{ url: data.groupId, txt: groupData.info.name }]}
  config={data.globals.config}
  loggedIn={data.loggedIn}
/>

<main>
  <div id="readme">
    <div>
      <Markdown source={groupData.readme} />
    </div>
  </div>

  <!-- TODO: Implement filtering -->

  <!-- List all entry cards -->
  <div id="item-list">
    <ItemCardGrid
      groupId={data.groupId}
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
  }
  #readme > div {
    margin: 5px;
  }
  /* #filters {
    width: 100%;
  } */
  #item-list {
    width: 100%;
  }
</style>

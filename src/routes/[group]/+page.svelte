<script lang="ts">
  import { Navbar, Markdown } from '$components';
  import { ItemCardGrid } from '$components/card';
  import Background from '$components/Background.svelte';
  import Paper from '$components/Paper.svelte';
    import EditableMarkdown from '$components/markdown';
    import api from '$endpoints';

  export let data: import('./$types').PageData;

  $: groupData = data.globals.groups[data.groupId];
</script>

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
  #item-list {
    width: 100%;
  }
</style>

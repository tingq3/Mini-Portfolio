<script lang="ts">
  import { Navbar, Markdown } from '$components';
  import { GroupCardGrid } from '$components/card';
  import Paper from '$components/Paper.svelte';

  export let data: import('./$types').PageData;
</script>

<Navbar
  path={[]}
  config={data.globals.config}
  loggedIn={data.loggedIn}
  createGroupButton
/>

<main>
  <div id="readme">
    <Paper>
      <div id="info-container">
        <Markdown source={data.globals.readme} />
      </div>
    </Paper>
  </div>

  <!-- List all entry cards -->
  <div id="group-list">
    <GroupCardGrid globals={data.globals} />
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
  }
  /* #filters {
    width: 100%;
  } */
  #group-list {
    width: 100%;
  }
</style>

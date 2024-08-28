<script lang="ts">
  import { Navbar } from '$components';
  import Background from '$components/Background.svelte';
  import { GroupCardGrid } from '$components/card';
  import EditableMarkdown from '$components/markdown';
  import Paper from '$components/Paper.svelte';
  import api from '$endpoints';

  export let data: import('./$types').PageData;
</script>

<Navbar
  path={[]}
  config={data.globals.config}
  loggedIn={data.loggedIn}
  createGroupButton
/>

<Background color={data.globals.config.color} />

<main>
  <div id="readme">
    <Paper>
      <div id="info-container">
        <EditableMarkdown
          source={data.globals.readme}
          editable={data.loggedIn}
          onSave={text => api().readme.set(text)}
        />
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
    width: 80%;
  }
</style>

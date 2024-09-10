<script lang="ts">
  import api from '$endpoints';
  import Background from '$components/Background.svelte';
  import Navbar from '$components/navbar';
  import Paper from '$components/Paper.svelte';
  import consts from '$lib/consts';

  export let data: import('./$types').PageData;
</script>

<svelte:head>
  <title>Admin - {data.globals.config.siteName}</title>
  <meta name="generator" content="{consts.APP_NAME}">
  <meta name="theme-color" content="{data.globals.config.color}">
  <!-- Prevent web crawlers from indexing the admin page -->
  <meta name="robots" content="noindex">
</svelte:head>

<Navbar
  path={[{ txt: 'Admin', url: 'admin' }]}
  config={data.globals.config}
  loggedIn={true}
/>

<Background color={data.globals.config.color} />

<main>
  <div id="paper-container">
    <Paper>
      <div id="contents">
        <div>
          <h2>Reload data from disk</h2>
          If you have edited your data manually, you can use this button to
          refresh it.
          <button on:click={() => api().admin.data.refresh()}>Refresh data</button>
        </div>
      </div>
    </Paper>
  </div>
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }
  #paper-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  #contents {
    padding: 20px;
  }
</style>

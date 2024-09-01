<script lang="ts">
  import api from '$endpoints';
  import Background from '$components/Background.svelte';
  import Navbar from '$components/navbar';
  import Paper from '$components/Paper.svelte';
  import consts from '$lib/consts';

  export let data: import('./$types').PageData;

  let config = structuredClone(data.globals.config);

  async function saveConfig() {
    await api().admin.config.put(config);
    // Replace the original data so that hitting revert will revert to the last
    // save
    data.globals.config = structuredClone(config);
  }

  function discardChanges() {
    config = structuredClone(data.globals.config);
  }
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
  config={config}
  loggedIn={true}
/>

<Background color={config.color} />

<main>
  <div id="paper-container">
    <Paper>
      <div id="contents">
        <form on:submit|preventDefault={saveConfig}>
          <div class="edit-buttons">
            <input type="submit" value="Save">
            <input on:click={discardChanges} type="submit" value="Revert" />
          </div>
          <h1>{consts.APP_NAME} Settings</h1>
          <h2>Site name</h2>
          <input placeholder="My portfolio" bind:value={config.siteName} required>
          <p>
            This is the name of your portfolio site. It is shown in the
            navigator in the top-left, and in your browser's tab name.
          </p>
          <h2>Theme color</h2>
          <input type="color" bind:value={config.color} required>
          <p>
            This is the main theme color for your portfolio site. It is subtly
            shown in the background on many pages.
          </p>
        </form>
        <div>
          <h2>Reload data from disk</h2>
          If you have edited the data manually, you can use this button to
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

  .edit-buttons {
    display: flex;
    flex-direction: row-reverse;
    gap: 10px;
  }
  input[type="submit"] {
    /* TODO: These buttons don't have properly-centred text */
    height: 2rem;
    background-color: rgb(221, 221, 221);
    border: none;
    border-radius: 5px;
    padding: 10px;
  }
  input[type="submit"]:hover {
    background-color: rgb(210, 210, 210);
    cursor: pointer;
  }
</style>

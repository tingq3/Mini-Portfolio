<script lang="ts">
  import api from '$endpoints';
  import Background from '$components/Background.svelte';
  import Navbar from '$components/navbar';
  import Paper from '$components/Paper.svelte';
  import consts from '$lib/consts';

  export let data: import('./$types').PageData;

  // Git setup
  let gitUrl = '';

  async function submitSwitchToGit() {
    await api().admin.git.init(gitUrl);
  }

  // Git controls
  let commitMessage = '';

  async function gitCommit() {
    await api().admin.git.commit(commitMessage);
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
  config={data.globals.config}
  loggedIn={true}
/>

<Background color={data.globals.config.color} />

<main>
  <div id="paper-container">
    <Paper>
      <div id="contents">
        <div>
          {#if data.repo}
          <h2>Git status</h2>
          <p>Current branch: {data.repo.branch}</p>
          <p>Current commit: {data.repo.commit}</p>
          <p>
            {#if data.repo.behind}
              {data.repo.behind} commits behind.
            {/if}
            {#if data.repo.ahead}
              {data.repo.ahead} commits ahead.
            {/if}
          </p>

          <!-- Push/pull -->
          {#if data.repo.behind}
          <button on:click={() => api().admin.git.push()}>Push</button>
          {:else if data.repo.ahead}
          <button on:click={() => api().admin.git.pull()}>Pull</button>
          {/if}

          <!-- Commit -->
           {#if !data.repo.clean}

           <h3>Changes</h3>

           <ul>
             {#each data.repo.changes as change}
              {#if change.from}
              <li>Rename {change.from} to ({change.path})</li>
              {:else if change.index === '?'}
              <li>Create {change.path}</li>
              {:else if change.index === 'D'}
              <li>Delete {change.path}</li>
              {:else}
              <li>Update {change.path}</li>
              {/if}
             {/each}
           </ul>

           <form on:submit|preventDefault={gitCommit}>
             <input required type="text" name="commit-message" id="commit-message" placeholder="Commit message" bind:value={commitMessage}>
             <input type="submit" value="Commit changes">
           </form>
           {/if}

          {:else}
          <h2>Git is currently not in use</h2>

          You can use a Git repository to back up your portfolio data. Enter the
          clone URL for an empty Git repository and it will be set up for you.

          <form on:submit|preventDefault={submitSwitchToGit}>
            <input required type="text" name="git-url" id="git-url" placeholder="git@github.com:MaddyGuthridge/Minifolio.git" bind:value={gitUrl}>
            <input type="submit" value="Switch to a Git repository">
          </form>
          {/if}
        </div>
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

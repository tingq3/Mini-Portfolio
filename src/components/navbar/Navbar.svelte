<script lang="ts">
  import { dev } from '$app/environment';
  import { goto } from '$app/navigation';
  import api from '$endpoints';
  import type { ConfigJson } from '$lib/server/data/config';
  import Separator from '$components/Separator.svelte';

  export let path: { url: string; txt: string }[];
  export let config: ConfigJson;
  /** Whether the user is logged in. Set to undefined if auth is disabled */
  export let loggedIn: boolean | undefined;

  /** Log out, then reload the page */
  async function logOut() {
    await api().admin.auth.logout();
    location.reload();
  }

  /**
   * Go to the login page, with the from parameter determining the origin page.
   */
  async function gotoLogin() {
    await goto(`/admin/login?from=${window.location.pathname}`);
  }

  /** Clear all data, and take the user to the firstrun page */
  async function clear() {
    await api().debug.clear();
    await goto('/admin/firstrun');
  }

  // This function needs to accept `path` as an input, otherwise the links
  // stop being reactive due to cacheing or something
  function pathTo(path: { url: string; txt: string }[], i: number) {
    return path
      .slice(0, i + 1)
      .map((p) => p.url)
      .join('/');
  }
</script>

<nav>
  <span style:grid-area="navigator">
    {#if path.length === 0}
      <h1>{config.siteName}</h1>
    {:else}
      <h1>
        <a href="/">{config.siteShortName}</a> /
        {#each path.slice(0, -1) as p, i}
          <a href="/{pathTo(path, i)}">{p.txt}</a>
          {'/ '}
        {/each}
        {path[path.length - 1].txt}
      </h1>
    {/if}
  </span>

  <!-- Control buttons -->
  <span id="control-buttons">
    {#if loggedIn}
      <button on:click={() => goto('/admin')}> Admin </button>
      <button on:click={logOut}> Log out </button>
    {:else if loggedIn !== undefined}
      <!-- Only include a login button if logging in is enabled -->
      <button on:click={gotoLogin}> Log in </button>
    {/if}
    <!-- About button navigates to about page -->
    <button on:click={() => goto('/about')}> About </button>
    <!-- In dev mode, add a quick shortcut to delete everything -->
    {#if dev}
      <Separator />
      <button on:click={clear}> Clear data </button>
    {/if}
  </span>
</nav>

<style>
  nav {
    display: grid;
    grid-template-columns: 1fr auto auto;
    grid-template-areas: "navigator empty control-buttons";
  }

  a {
    color: black;
    text-decoration: none;
  }
  a:hover {
    text-decoration: underline;
  }

  h1 {
    font-size: 3em;
  }

  #control-buttons {
    display: flex;
    align-items: center;
    justify-content: center;
    grid-area: control-buttons;
    margin-right: 20px;
  }
  #control-buttons button {
    /* margin: 10px; */
    padding: 10px;
    background-color: transparent;
    border-radius: 5px;
    border: none;
  }
  #control-buttons button:hover {
    cursor: pointer;
    background-color: rgba(124, 124, 124, 0.253);
  }
</style>

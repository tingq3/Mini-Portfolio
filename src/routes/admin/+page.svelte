<script lang="ts">
  import Background from '$components/Background.svelte';
  import Navbar from '$components/navbar';
  import Paper from '$components/Paper.svelte';
  import consts from '$lib/consts';
  import GitSettings from './GitSettings.svelte';
  import ChangePassword from './ChangePassword.svelte';
  import ReloadData from './ReloadData.svelte';
  import LogOutAll from './LogOutAll.svelte';
  import KeySettings from './KeySettings.svelte';

  type Props = {
    data: import('./$types').PageData;
  };

  let { data }: Props = $props();
</script>

<svelte:head>
  <title>Admin - {data.globals.config.siteName}</title>
  <meta name="generator" content={consts.APP_NAME} />
  <meta name="theme-color" content={data.globals.config.color} />
  <!-- Prevent web crawlers from indexing the admin page -->
  <meta name="robots" content="noindex" />
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
        <GitSettings {data} />
        <KeySettings
          publicKey={data.keys.publicKey}
          privateKeyPath={data.keys.keyPath}
        />
        <ChangePassword username={'admin'} />
        <LogOutAll />
        <ReloadData />
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

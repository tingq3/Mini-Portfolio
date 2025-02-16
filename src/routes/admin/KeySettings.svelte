<!-- Settings panel for managing the server's public key. -->
<script lang="ts">
  import { preventDefault } from 'svelte/legacy';

  import CopyButton from '$components/CopyButton.svelte';
  import api from '$endpoints';
  import { APP_NAME } from '$lib/consts';

  type Props = {
    /** Public key currently being used by the server */
    publicKey: string | null;
    /** Path to the server's private key */
    privateKeyPath: string | null;
  };

  let { publicKey = $bindable(), privateKeyPath = $bindable() }: Props =
    $props();

  /** Setting key path */
  let newKeyPath = $state('');

  /** Use the SSH key at the given path */
  async function useKeyAtPath() {
    const newKey = await api().admin.keys.setKeyPath(newKeyPath);
    publicKey = newKey.publicKey;
    privateKeyPath = newKey.keyPath;
    newKeyPath = '';
  }

  /** Generate a new SSH key */
  async function generateNewKey() {
    const newKey = await api().admin.keys.generate();
    publicKey = newKey.publicKey;
    privateKeyPath = newKey.keyPath;
  }

  /** Use system SSH keys */
  async function useSystemSsh() {
    await api().admin.keys.disable();
    publicKey = null;
    privateKeyPath = null;
  }
</script>

<div>
  <h2>SSH key settings</h2>
  {#if privateKeyPath === null}
    <p>
      {APP_NAME} is using your system's default SSH configuration. Note that in Docker,
      this may be unset, unless you are forwarding your host's SSH agent.
    </p>
    <form onsubmit={preventDefault(() => void useKeyAtPath)}>
      <p>Use the given SSH key-pair</p>
      <p>
        <input
          type="text"
          bind:value={newKeyPath}
          placeholder="/path/to/private/key"
        />
      </p>
      <p><input type="submit" value="Set SSH key path" /></p>
    </form>
    <form onsubmit={preventDefault(() => void generateNewKey)}>
      <p>Generate a new SSH key-pair</p>
      <p><input type="submit" value="Generate SSH key" /></p>
    </form>
  {:else}
    <p>{APP_NAME} is using an SSH key at the path <em>{privateKeyPath}</em>.</p>

    <p>Public key is:</p>
    <pre>{publicKey}</pre>
    <CopyButton text={publicKey ?? ''}>Copy to clipboard</CopyButton>
    <form onsubmit={preventDefault(() => void useKeyAtPath)}>
      <p>Use the given SSH key-pair</p>
      <p>
        <input
          type="text"
          bind:value={newKeyPath}
          placeholder="/path/to/private/key"
        />
      </p>
      <p><input type="submit" value="Set SSH key path" /></p>
    </form>
    <form onsubmit={preventDefault(() => void generateNewKey)}>
      <p>Generate a new SSH key-pair</p>
      <p><input type="submit" value="Generate SSH key" /></p>
    </form>
    <form onsubmit={preventDefault(() => void useSystemSsh)}>
      <p>Use the system's SSH configuration</p>
      <p><input type="submit" value="Use system SSH" /></p>
    </form>
  {/if}
</div>

<style>
</style>

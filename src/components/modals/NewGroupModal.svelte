<script lang="ts">
  import Modal from './Modal.svelte';
  import api from '$endpoints';
  import { goto } from '$app/navigation';

  type Props = {
    show: boolean;
    onclose: () => void;
  };

  let { show, onclose }: Props = $props();

  let groupName = $state('');
  let groupId = $state('');
  let groupDescription = $state('');
  let userModifiedId = $state(false);

  function resetAndClose() {
    groupName = '';
    groupDescription = '';
    groupId = '';
    userModifiedId = false;
    onclose();
  }

  function nameToId(name: string): string {
    // TODO: Make this a little more reliable
    return name.toLowerCase().replaceAll(' ', '-');
  }

  async function makeGroup() {
    await api().group.withId(groupId).create(groupName, groupDescription);
    await goto(`/${groupId}`);
  }
</script>

<Modal {show} onclose={resetAndClose}>
  {#snippet header()}
    <h2>New group</h2>
  {/snippet}
  <form
    onsubmit={(e) => {
      e.preventDefault();
      void makeGroup();
    }}
  >
    <p>
      Group name
      <input
        placeholder="Projects"
        bind:value={groupName}
        required
        oninput={() => {
          // Whenever the user modifies the name, we should update the ID
          // to match, until the user modifies the ID themselves
          if (!userModifiedId) {
            groupId = nameToId(groupName);
          }
        }}
      />
    </p>
    <p>
      Group ID
      <input
        placeholder="projects"
        required
        bind:value={groupId}
        oninput={() => {
          userModifiedId = true;
        }}
      />
    </p>
    <p>
      Group description
      <input
        placeholder="Projects I have created"
        bind:value={groupDescription}
      />
    </p>
    <p>
      <input type="submit" value="Create" />
    </p>
  </form>
</Modal>

<style>
  form {
    margin: 10px;
  }

  form p {
    display: flex;
    gap: 10px;
    width: 100%;
  }
  form p input {
    flex: 1;
    height: 1.2rem;
  }

  input[type='submit'] {
    height: 2rem;
    background-color: transparent;
    border: none;
    border-radius: 5px;
  }

  input[type='submit']:hover {
    background-color: rgba(124, 124, 124, 0.253);
    cursor: pointer;
  }
</style>

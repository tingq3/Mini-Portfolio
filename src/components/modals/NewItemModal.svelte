<script lang="ts">
  import Modal from './Modal.svelte';
  import api from '$endpoints';
  import { goto } from '$app/navigation';

  type Props = {
    show: boolean;
    groupId: string;
    onclose: () => void;
  };

  let { show, groupId, onclose }: Props = $props();

  let itemName = $state('');
  let itemId = $state('');
  let itemDescription = $state('');
  let userModifiedId = $state(false);

  function resetAndClose() {
    itemName = '';
    itemDescription = '';
    itemId = '';
    userModifiedId = false;
    onclose();
  }

  function nameToId(name: string): string {
    // TODO: Make this a little more reliable
    return name.toLowerCase().replaceAll(' ', '-');
  }

  async function makeItem() {
    await api()
      .group.withId(groupId)
      .item.withId(itemId)
      .create(itemName, itemDescription);
    await goto(`/${groupId}/${itemId}`);
  }
</script>

<Modal {show} onclose={resetAndClose}>
  {#snippet header()}
    <h2>New item</h2>
  {/snippet}
  <p>Creating an item within the group '{groupId}'.</p>
  <form onsubmit={makeItem}>
    <p>
      Item name
      <input
        placeholder="Manyfolio"
        bind:value={itemName}
        required
        oninput={() => {
          // Whenever the user modifies the name, we should update the ID
          // to match, until the user modifies the ID themselves
          if (!userModifiedId) {
            itemId = nameToId(itemName);
          }
        }}
      />
    </p>
    <p>
      Item ID
      <input
        placeholder="manyfolio"
        required
        bind:value={itemId}
        oninput={() => {
          userModifiedId = true;
        }}
      />
    </p>
    <p>
      Item description
      <input
        placeholder="A data-driven portfolio website"
        bind:value={itemDescription}
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

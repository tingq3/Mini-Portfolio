<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import Modal from './Modal.svelte';
  import api from '$endpoints';
  import { goto } from '$app/navigation';

  export let show: boolean;
  export let groupId: string;

  let itemName = '';
  let itemId = '';
  let itemDescription = '';
  let userModifiedId = false;

  const dispatch = createEventDispatcher();

  function resetAndClose() {
    itemName = '';
    itemDescription = '';
    itemId = '';
    userModifiedId = false;
    dispatch('close');
  }

  function nameToId(name: string): string {
    // TODO: Make this a little more reliable
    return name.toLowerCase().replaceAll(' ', '-');
  }

  async function makeItem() {
    await api().group.withId(groupId).item.withId(itemId).create(itemName, itemDescription);
    await goto(`/${groupId}/${itemId}`);
  }
</script>

<Modal {show} on:close={resetAndClose}>
  <h2 slot="header">New item</h2>
  <p>Creating an item within the group '{groupId}'.</p>
  <form on:submit|preventDefault={makeItem}>
    <p>
      Item name
      <input
        placeholder="Manyfolio"
        bind:value={itemName}
        required
        on:input={() => {
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
      <input placeholder="manyfolio" required bind:value={itemId} on:input={() => { userModifiedId = true; }} />
    </p>
    <p>
      Item description
      <input placeholder="A data-driven portfolio website" bind:value={itemDescription} />
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

  input[type="submit"] {
    height: 2rem;
    background-color: transparent;
    border: none;
    border-radius: 5px;
  }

  input[type="submit"]:hover {
    background-color: rgba(124, 124, 124, 0.253);
    cursor: pointer;
  }
</style>

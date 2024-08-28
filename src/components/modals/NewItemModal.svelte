<script lang="ts">
  import Modal from './Modal.svelte';
  export let show: boolean;
  export let groupId: string;
</script>

<Modal {show} on:close>
  <h2 slot="header">New item</h2>
  Creating a new item within the group '{groupId}'
  <form>
    <input />
    <input />
    <input />
    <input type="submit" />
  </form>
</Modal>

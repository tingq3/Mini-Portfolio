<script lang="ts">
  import Modal from './Modal.svelte';

  export let header: string;
  export let text: string;
  export let show: boolean;
</script>

<Modal {show} color="#ffaaaa" on:close>
  <h1 slot="header">{header}</h1>
  <i class="las la-exclamation-circle"></i>
  <p>{text}</p>
</Modal>

<style>
  i {
    font-size: 3rem;
  }
</style>

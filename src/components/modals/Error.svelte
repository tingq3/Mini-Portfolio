<script lang="ts">
  import Modal from './Modal.svelte';

  interface Props {
    header: string;
    text: string;
    show: boolean;
  }

  let { text, show }: Props = $props();
</script>

<Modal {show} color="#ffaaaa" on:close>
  {#snippet header()}
    <h1 >{header}</h1>
  {/snippet}
  <i class="las la-exclamation-circle"></i>
  <p>{text}</p>
</Modal>

<style>
  i {
    font-size: 3rem;
  }
</style>

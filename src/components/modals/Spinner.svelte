<script lang="ts">
  import Modal from './Modal.svelte';

  export let header: string;
  export let text: string;
  export let show: boolean;
</script>

<Modal {show} color="white" canClose={false}>
  <h1 slot="header">{header}</h1>
  <i class="las la-sync spin"></i>
  <p>{text}</p>
</Modal>

<style>
  @keyframes rotating {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  .spin {
    animation: rotating 2s linear infinite;
    font-size: 3rem;
  }
</style>

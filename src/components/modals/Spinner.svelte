<script lang="ts">
  import Modal from './Modal.svelte';

  type Props = {
    header: string;
    text: string;
    show: boolean;
  };

  let { text, show }: Props = $props();
</script>

<Modal {show} color="white" showCloseButton={false} onclose={() => {}}>
  {#snippet header()}
    <h1>{header}</h1>
  {/snippet}
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

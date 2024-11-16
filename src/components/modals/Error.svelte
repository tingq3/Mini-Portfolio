<script lang="ts">
  import Modal from './Modal.svelte';

  type Props = {
    header: string;
    text: string;
    show: boolean;
    onclose: () => void;
  };

  let { text, show, onclose }: Props = $props();
</script>

<Modal {show} color="#ffaaaa" {onclose}>
  {#snippet header()}
    <h1>{header}</h1>
  {/snippet}
  <i class="las la-exclamation-circle"></i>
  <p>{text}</p>
</Modal>

<style>
  i {
    font-size: 3rem;
  }
</style>

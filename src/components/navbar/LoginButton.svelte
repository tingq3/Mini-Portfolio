<script lang="ts">
  import { goto } from '$app/navigation';
  import api from '$endpoints';
  export let loggedIn: boolean;

  async function logOut() {
    await api().admin.auth.logout();
    location.reload();
  }
</script>

{#if loggedIn}
  <button on:click={logOut}>Log out</button>
{:else}
  <button on:click={() => goto('/admin/login')}>Log in</button>
{/if}

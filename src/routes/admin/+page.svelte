<script lang="ts">
  import Navbar from '$components/Navbar.svelte';
  import { goto } from '$app/navigation';
  import { token } from '$lib';

  export let data: import('./$types').PageData;

  // If the user is not already logged in, send them to the login page
  if (!$token) {
    // FIXME: Fails when using SSR
    void goto('/admin/login');
  }
</script>

<Navbar
  path={[{ txt: 'Admin', url: 'admin' }]}
  globals={data.globals}
/>

<h1>Admin panel (todo)</h1>

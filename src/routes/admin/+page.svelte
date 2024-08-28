<script lang="ts">
  import Navbar from '$components/navbar/Navbar.svelte';
  export let data: import('./$types').PageData;
</script>

<Navbar
  path={[{ txt: 'Admin', url: 'admin' }]}
  config={data.globals.config}
  loggedIn={true}
/>

<h1>Admin panel (todo)</h1>

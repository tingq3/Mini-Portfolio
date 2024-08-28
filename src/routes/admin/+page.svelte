<script lang="ts">
  import Background from '$components/Background.svelte';
  import Navbar from '$components/navbar/Navbar.svelte';
  export let data: import('./$types').PageData;
</script>

<Navbar
  path={[{ txt: 'Admin', url: 'admin' }]}
  config={data.globals.config}
  loggedIn={true}
/>

<Background color={data.globals.config.color} />

<h1>Admin panel (todo)</h1>

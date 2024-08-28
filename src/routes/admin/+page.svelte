<script lang="ts">
  import Navbar from '$components/Navbar.svelte';
  export let data: import('./$types').PageData;
</script>

<Navbar
  path={[{ txt: 'Admin', url: 'admin' }]}
  globals={data.globals}
/>

<h1>Admin panel (todo)</h1>

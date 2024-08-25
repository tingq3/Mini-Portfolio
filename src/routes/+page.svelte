<script lang="ts">
  import { Navbar, Markdown } from '$components';
  import { GroupCardGrid } from '$components/card';
  import Background from '$components/Background.svelte';

  export let data: import('./$types').PageData;
</script>

<Navbar
  path={[]}
  globals={data.globals}
/>

<main>
  <div id="readme">
    <div>
      <Markdown source={data.globals.readme} />
    </div>
  </div>

  <!-- List all entry cards -->
  <div id="group-list">
    <GroupCardGrid globals={data.globals} />
  </div>
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }
  #readme {
    width: 100%;
  }
  #readme > div {
    margin: 5px;
  }
  /* #filters {
    width: 100%;
  } */
  #group-list {
    width: 100%;
  }
</style>

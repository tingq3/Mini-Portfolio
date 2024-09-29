<script>
  import api from "$endpoints";
</script>

<div>
  <h2>Reload data from disk</h2>
  If you have edited your data manually, you can use this button to refresh it.
  <button on:click={() => api().admin.data.refresh()}>Refresh data</button>
</div>

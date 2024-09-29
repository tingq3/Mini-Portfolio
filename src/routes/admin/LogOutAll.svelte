<script lang="ts">
  import { goto } from "$app/navigation";
  import api from "$endpoints";

  async function logOut() {
    await api().admin.auth.revoke();
    goto("/admin/login");
  }
</script>

<div>
  <h2>Log out of all sessions</h2>
  <p>This will sign you out on all of your devices (including this one).</p>
  <button on:click={logOut}>Log out of all sessions</button>
</div>

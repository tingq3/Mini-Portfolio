<script lang="ts">
  import api from '$endpoints';
  import Background from '$components/Background.svelte';
  import Navbar from '$components/Navbar.svelte';
  import Paper from '$components/Paper.svelte';
  import { goto } from '$app/navigation';

  export let data: import('./$types').PageData;

  let username = '';
  let password = '';

  async function doLogin() {
    await api().admin.auth.login(username, password);
    // TODO: Cleanly handle and display errors
    await goto('/admin');
  }
</script>

<Background color="#aa00aa"></Background>

<Navbar
  globals={data.globals}
  path={[
    { txt: 'Admin', url: 'admin' },
    { txt: 'Login', url: 'login' },
  ]}
/>

<div class="center">
  <Paper>
    <main>
      <div class="center">
        <h1 style="font-size: 3rem"> Login </h1>
      </div>

      <form>
        <h3>Username</h3>
        <input type="text" id="username" bind:value={username} placeholder="Username" />

        <h3>Password</h3>
        <input type="password" id="password" bind:value={password} placeholder="Your complex and secure password" />
        <p></p>
        <input type="submit" id="submit-main" value="Log in" on:click={doLogin} />
      </form>
    </main>
  </Paper>
</div>

<style>
  .center {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  main {
    margin: 20px;
  }

  form {
    margin: 0 10%;
  }

  form input {
    width: 100%;
    height: 2em;
    border-radius: 5px;
    border-style: solid;
  }

  form input[type="submit"] {
    font-size: 1rem;
    font-weight: bold;
  }
</style>

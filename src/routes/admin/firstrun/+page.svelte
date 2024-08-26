<script lang="ts">
  import api from '$endpoints';
  import Paper from '$components/Paper.svelte';
  import Background from '$components/Background.svelte';
  import Spinner from '$components/modals/Spinner.svelte';
  import Error from '$components/modals/Error.svelte';
  import Modal from '$components/modals/Modal.svelte';
  import type { FirstRunCredentials } from '$lib/server/auth';
  import { token } from '$lib';
  import { goto } from '$app/navigation';

  let repoUrl = '';
  let repoBranch = '';
  let credentials: FirstRunCredentials | undefined;

  async function submitMain() {
    showLoading = true;
    try {
      const res = await api.admin.firstrun(repoUrl, repoBranch || null);
      credentials = res.credentials;
      token.set(credentials.token);
    } catch (e) {
      errorText = `${e}`;
      showLoading = false;
    }
  }

  async function submitNoGit() {
    try {
      const res = await api.admin.firstrun(null, null);
      credentials = res.credentials;
      token.set(credentials.token);
    } catch (e) {
      errorText = `${e}`;
      showLoading = false;
    }
  }

  let showLoading = false;

  let errorText = '';
</script>

<h1>Maddyfolio</h1>

<Background color="#aa00aa"></Background>

<div class="center">
  <Paper>
    <main>
      <div class="center">
        <h1 style="font-size: 3rem"> Welcome to your fancy new portfolio website! </h1>
        <h2>Let's get set up!</h2>
      </div>

      <form>
        <h3>Data repository URL</h3>
        <input type="text" id="repo-url" bind:value={repoUrl} placeholder="git@github.com:MaddyGuthridge/portfolio.git" />
        <p>
          It's a good idea to set up a repository to back up your portfolio data.
          <a
            href="https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-new-repository"
            target="_blank"
          >Create an empty git repository</a>
          and enter the clone URL here. If you want to import existing data, enter
          your existing repository URL here.
        </p>

        <h3>Repository branch</h3>
        <input type="text" id="repo-branch" bind:value={repoBranch} placeholder="main" />
        <p>If you want to use a specific branch, you can enter it above.</p>

        <h3>Ready to get started?</h3>
        <input type="submit" id="submit-main" value="Let's go!" on:click={submitMain} />

        <h3>Don't want to use a git repo?</h3>
        <p>
          Using a git repo is a great idea if you want your data to be  safely
          backed up. But if you're just testing Maddyfolio, it's much quicker
          to get started without a git repo.
        </p>
        <input type="submit" id="submit-no-git" value="I don't want to use git" on:click={submitNoGit} />
      </form>
    </main>
  </Paper>
</div>

<!-- Spinner shows while setting up data dir -->
<Spinner show={showLoading} header="Just a moment..." text="We're setting up your data" />

<!-- Error shows if error occurs with setup -->
<Error show={errorText !== ''} header="Oh no!" text={errorText} on:close={() => { errorText = ''; }} />

{#if credentials}
  <Modal show={true} on:close={() => goto('/')}>
    <h1 slot="header">Your data is set up!</h1>
    <p>This is your login information. Please ensure you do not lose it.</p>
    <!-- TODO: Add copy buttons for convenience -->
    <p>Username: {credentials.username}</p>
    <p>Password: {credentials.password}</p>
  </Modal>
{/if}

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

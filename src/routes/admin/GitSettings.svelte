<script lang="ts">
  import api from '$endpoints';

  type Props = {
    data: import('./$types').PageData;
  };

  let { data }: Props = $props();

  // Git setup
  let gitUrl = $state('');

  async function submitSwitchToGit() {
    await api().admin.git.init(gitUrl);
  }

  // Git controls
  let commitMessage = $state('');

  async function gitCommit() {
    await api().admin.git.commit(commitMessage);
  }
</script>

<div>
  {#if data.repo}
    <h2>Git status</h2>
    <p>Current branch: {data.repo.branch}</p>
    <p>Current commit: {data.repo.commit}</p>
    <p>
      {#if data.repo.behind}
        {data.repo.behind} commits behind.
      {/if}
      {#if data.repo.ahead}
        {data.repo.ahead} commits ahead.
      {/if}
    </p>

    <!-- Push/pull -->
    {#if data.repo.behind}
      <button onclick={() => api().admin.git.pull()}>Pull</button>
    {:else if data.repo.ahead}
      <button onclick={() => api().admin.git.push()}>Push</button>
    {/if}

    <!-- Commit -->
    {#if data.repo.clean}
      <h3>Changes</h3>
      Working tree clean.
    {:else}
      <h3>Changes</h3>

      <ul>
        {#each data.repo.changes as change}
          {#if change.from}
            <li>Rename {change.from} to ({change.path})</li>
          {:else if change.index === '?'}
            <li>Create {change.path}</li>
          {:else if change.index === 'D'}
            <li>Delete {change.path}</li>
          {:else}
            <li>Update {change.path}</li>
          {/if}
        {/each}
      </ul>

      <form
        onsubmit={(e) => {
          e.preventDefault();
          void gitCommit();
        }}
      >
        <input
          required
          type="text"
          name="commit-message"
          id="commit-message"
          placeholder="Commit message"
          bind:value={commitMessage}
        />
        <input type="submit" value="Commit changes" />
      </form>
    {/if}
  {:else}
    <h2>Git is currently not in use</h2>

    You can use a Git repository to back up your portfolio data. Enter the clone
    URL for an empty Git repository and it will be set up for you.

    <form
      onsubmit={(e) => {
        e.preventDefault();
        void submitSwitchToGit();
      }}
    >
      <input
        required
        type="text"
        name="git-url"
        id="git-url"
        placeholder="git@github.com:MaddyGuthridge/Minifolio.git"
        bind:value={gitUrl}
      />
      <input type="submit" value="Switch to a Git repository" />
    </form>
  {/if}
</div>

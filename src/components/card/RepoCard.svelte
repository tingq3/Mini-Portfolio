<script lang="ts">
  import type { RepoInfo } from '$types/repo';
  import { repoIsWithProvider, repoProviders } from '$lib/repo';
  import { Card } from '.';
    import { onMount } from 'svelte';

  export let repo: RepoInfo;
  export let color: string;

  $: repoUrl = (
    repoIsWithProvider(repo)
      ? repoProviders[repo.provider].makeUrl(repo.path)
      : repo.url);

  $: repoString = (
    repoIsWithProvider(repo)
      ? `${repoProviders[repo.provider].name}: ${repo.path}`
      : repo.title);

  $: repoIcon = (
    repoIsWithProvider(repo)
      ? repoProviders[repo.provider].icon
      : repo.icon);

  async function fetchRepoStarCount(repo: RepoInfo): Promise<number | undefined> {
    // Manual repos can't display star counts
    if (!repoIsWithProvider(repo)) {
      return Promise.resolve(undefined);
    }

    const provider = repoProviders[repo.provider];
    if (provider.getStarCount === undefined) {
      // No way to fetch the star count
      return Promise.resolve(undefined);
    } else {
      // Fetch the star count
      return provider.getStarCount(repo.path);
    }
  }

  let repoStarCount: Promise<number | undefined> = Promise.resolve(undefined);

  onMount(() => {
    repoStarCount = fetchRepoStarCount(repo);
  });
</script>

<Card
  link={repoUrl}
  newTab={true}
  {color}
>
  <span>
    <div class="icon-div">
        <i class={repoIcon}></i>
    </div>
    <h3>{repoString}</h3>
    <div class="star-count">
      {#await repoStarCount}
        <i class="lar la-star"></i> <i class="las la-sync spinner"></i>
      {:then stars}
        {#if stars}
          <i class="lar la-star"></i> {stars}
        {/if}
      {:catch e}
        <i class="lar la-star"></i> {e}
      {/await}
    </div>
  </span>
</Card>

<style>
  span {
    display: flex;
    gap: 10px;
    align-items: center;
  }

  .icon-div {
    font-size: 3em;
  }

  .star-count {
    font-size: 1.5em;
  }

  .spinner {
    animation: spin 1s infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
</style>

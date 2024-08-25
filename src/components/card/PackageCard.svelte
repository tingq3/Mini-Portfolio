<script lang="ts">
  import { packageIsWithProvider, packageProviders } from '$lib/packageInfo';
  import { Card } from '.';
  import { tooltip } from '$lib/tooltip';
  import type { PackageInfo } from '$lib/server/data/itemPackage';

  export let info: PackageInfo;
  export let color: string;

  $: packageUrl = (
    packageIsWithProvider(info)
      ? packageProviders[info.provider].makeUrl(info.id)
      : info.url);

  $: providerName = (
    packageIsWithProvider(info)
      ? packageProviders[info.provider].name
      : info.providerName);

  $: providerIcon = (
    packageIsWithProvider(info)
      ? packageProviders[info.provider].icon
      : info.icon);

  $: installCommand = (
    packageIsWithProvider(info)
      ? packageProviders[info.provider].makeInstallCmd(info.id)
      : info.command);

  async function copyInstallCommand() {
    await navigator.clipboard.writeText(installCommand);
  }
</script>

<Card
  link={packageUrl}
  newTab={true}
  {color}
>
  <span>
    <div class="provider-info">
      <i class={providerIcon}></i>
      <b>{providerName}</b>
    </div>
    <button
      class="install-cmd"
      on:click|preventDefault={copyInstallCommand}
      use:tooltip={{ content: 'Copy installation command' }}
    >
      <i class="las la-terminal"></i>
      <pre>{installCommand}</pre>
  </button>
  </span>
</Card>

<style>
  span {
    display: flex;
    align-items: center;
    gap: 20px;
    height: 100%;
  }
  /* Icons */
  i {
    font-size: 2em;
  }
  .provider-info {
    display: flex;
    align-items: center;
  }
  /*
    Reset button properties
    https://stackoverflow.com/a/54101412/6335363
  */
  button {
    all: unset;
  }
  .install-cmd {
    display: flex;
    align-items: center;
    background-color: rgba(255, 255, 255, 0.5);
    padding: 2px 10px;
    cursor: pointer;
    border-radius: 5px;
    border-color: rgba(0, 0, 0, 0.178);
    border-width: 1px;
    border-style: solid;
    transition: background-color .5s;
  }
  .install-cmd:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }
  .install-cmd:focus {
    border-color: rgba(0, 0, 0, 0.623);
  }
  .install-cmd:active {
    background-color: rgba(255, 255, 255, 0.9);
    transition: background-color 0s;
  }
  pre {
    font-size: 1.5em;
    margin: 0px;
  }
</style>

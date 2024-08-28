<script lang="ts">
  import { packageIsWithProvider, packageProviders } from '$lib/packageInfo';
  import { Card } from '.';
  import { tooltip } from '$lib/tooltip';
  import type { PackageInfo } from '$lib/server/data/itemPackage';
    import CopyButton from '$components/CopyButton.svelte';

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
    <CopyButton
      text={installCommand}
      hint='Copy install command'
    >
      <i class="las la-terminal"></i>
      <pre>{installCommand}</pre>
    </CopyButton>
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
  pre {
    font-size: 1.5em;
    margin: 0px;
  }
</style>

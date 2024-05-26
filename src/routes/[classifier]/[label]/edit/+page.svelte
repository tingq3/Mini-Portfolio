<script lang="ts">
  import OrdRec from '$lib/OrderedRecord';
  import { getAssociatedLabels, getClassifier } from '$lib/util';
    import { Navbar, Markdown } from '$components';
    import { ChipList } from '$components/chip';
    import { CardGrid, IconCard, RepoCard, PackageCard, CardList, Card } from '$components/card';
    import { filterAssociatedLabelsByDisplayType, getAssociationDisplayInfo } from '../associations';
    import MarkdownEditor from '$components/MarkdownEditor.svelte';
    import type { Label } from '$types';
    import { supportedPackageRepos, type PackageProvider } from '$types/packageInfo';
    import { packageProviders } from '$lib/packageInfo';
    // import AsciinemaPlayer from "$components";

    export let data: import('./$types').PageData;

    $: classifier = OrdRec.fromItems(data.globals.classifiers).get(data.classifier);
    $: label = OrdRec.fromItems(classifier.labels).get(data.label);

    // List of associated labels, grouped by classifier
    $: associatedLabels = getAssociatedLabels(data.globals, label);

    $: linkContent = label.info.links;

    async function onSubmit() {
      // TODO: Update label links from link content
      // TODO: Update package info
      const res = await fetch('', {
        method: 'POST',
        body: JSON.stringify(label),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Update: got status', res.status);
    }

    function onChangePackageProvider(newValue: PackageProvider | 'custom') {
      const prevInfo = label.info.package;
      // Provider to custom
      if (prevInfo && prevInfo.provider !== 'custom' && newValue === 'custom') {
        label.info.package = {
          provider: 'custom',
          providerName: packageProviders[prevInfo.provider].name,
          command: packageProviders[prevInfo.provider].makeInstallCmd(prevInfo.id),
          url: packageProviders[prevInfo.provider].makeUrl(prevInfo.id),
          icon: packageProviders[prevInfo.provider].icon,
        };
      }
      // TODO: improve this
    }
</script>

<Navbar
  path={[
    { url: classifier.slug, txt: classifier.info.name },
    { url: label.slug, txt: label.info.name },
    { url: 'edit', txt: 'Edit' },
  ]}
  globals={data.globals}
/>

<form on:submit|preventDefault={onSubmit}>
  <div id="info-container">
    <!-- Edit name and description -->
    <input name="label-name" class="text-input title" bind:value={label.info.name} />
    <input name="label-description" class="text-input description" bind:value={label.info.description} />
    <div class="color-input">
      Choose a color:
      <input type="color" bind:value={label.info.color} />
    </div>
    <!-- Edit markdown contents -->
    <MarkdownEditor bind:source={label.readme} />

    <!-- Options to edit links and package information -->
    <CardList>
      <!-- Website -->
      <Card color={linkContent.site ? label.info.color : '#AAAAAA'}>
        <h3 slot="top">Website</h3>
        <div>
          <input
            type="url"
            class="text-input"
            bind:value={linkContent.site}
          >
        </div>
      </Card>
      <!-- Documentation -->
      <Card color={linkContent.docs ? label.info.color : '#AAAAAA'}>
        <h3 slot="top">Documentation</h3>
        <div>
          <input
            type="url"
            class="text-input"
            bind:value={linkContent.docs}
          >
        </div>
      </Card>
      <!-- TODO: Repo -->
      <!-- TODO: Package -->
      <Card color={label.info.package?.provider ? label.info.color : '#AAAAAA'}>
        <h3 slot="top">Package</h3>
        <div>
          <!-- Choose package provider -->
          <!--
            TODO: Can't figure out how to make this update properly, is very yucky
            Honestly I should just make this its own component so I can hide
            the utter awfulness.
          -->
          <select
            value={label.info.package ? label.info.package.provider : 'custom'}
            on:change={() => {}}
          >
            <option value="custom">
              Custom
            </option>
            <!-- Each of the allowed providers -->
            {#each supportedPackageRepos as repo}
              <option value={repo}>
                <i class={packageProviders[repo].icon}></i> {packageProviders[repo].name}
              </option>
            {/each}
          </select>
          <!-- If provider is a default one -->
          {#if label.info.package === undefined}
            Bruh
          {:else if label.info.package.provider === 'custom'}
            <input class="text-input" bind:value={label.info.package.providerName} />
            <input class="text-input" bind:value={label.info.package.url} />
            <input class="text-input" bind:value={label.info.package.command} />
            <input class="text-input" bind:value={label.info.package.icon} />
          {:else}
            <input class="text-input" bind:value={label.info.package.id} />
          {/if}
        </div>
      </Card>
    </CardList>

    <!-- Show chips for the associations that want them -->
    <div>
      {#each filterAssociatedLabelsByDisplayType(data.globals, associatedLabels, classifier, 'chip').items() as [assClass, assLabels] }
        <div class="association-chip-row">
          <h3>{getAssociationDisplayInfo(getClassifier(data.globals, assClass), classifier).title}:</h3>
          <ChipList labels={OrdRec.fromItems([[assClass, assLabels]])} link={true} />
        </div>
      {/each}
    </div>
  </div>
  <input type="submit" value="Save" />
</form>

<style>
  form {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .text-input {
    width: 100%;
    margin: 5px;
    padding: 5px;
    border-radius: 5px;
    border-style: solid;
  }

  .title {
    font-size: 3em;
  }

  .description {
    font-size: 1.5em;
  }

  .color-input {
    width: 100%;
    height: 3em;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  #info-container {
    width: 80%;
    border-radius: 10px;
    box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.37);
    padding: 20px;
  }

  .association-chip-row {
    display: flex;
    align-items: baseline;
    gap: 5px;
    margin: 10px 0;
  }
  .association-chip-row > h3 {
    margin: 0;
    height: min-content;
  }

  input[type="submit"] {
    margin: 10px;
    width: 90%;
    height: 50px;
  }
</style>

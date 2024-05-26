<script lang="ts">
  import OrdRec from '$lib/OrderedRecord';
  import { getAssociatedLabels, getClassifier } from '$lib/util';
    import { Navbar, Markdown } from '$components';
    import { ChipList } from '$components/chip';
    import { CardGrid, IconCard, RepoCard, PackageCard, CardList } from '$components/card';
    import { filterAssociatedLabelsByDisplayType, getAssociationDisplayInfo } from '../associations';
    import MarkdownEditor from '$components/MarkdownEditor.svelte';
    // import AsciinemaPlayer from "$components";

    export let data: import('./$types').PageData;

    $: classifier = OrdRec.fromItems(data.globals.classifiers).get(data.classifier);
    $: label = OrdRec.fromItems(classifier.labels).get(data.label);

    // List of associated labels, grouped by classifier
    $: associatedLabels = getAssociatedLabels(data.globals, label);

    async function onSubmit() {
      const res = await fetch('', {
        method: 'POST',
        body: JSON.stringify(label),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Update: got status', res.status);
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

  <!-- Display links if needed -->
  <div id="links-list">
    <CardList>
      {#if label.info.links.site}
        <IconCard
          title="Visit the website"
          link={label.info.links.site}
          color={label.info.color}
        >
        <i slot="icon" class="las la-globe"></i>
        </IconCard>
      {/if}
      {#if label.info.links.docs}
        <IconCard
          title="View the documentation"
          link={label.info.links.docs}
          color={label.info.color}
        >
          <i slot="icon" class="lab la-readme"></i>
        </IconCard>
      {/if}
      {#if label.info.links.repo}
        <RepoCard
          repo={label.info.links.repo}
          color={label.info.color}
        />
      {/if}
      {#if label.info.package}
        <PackageCard
          info={label.info.package}
          color={label.info.color}
        />
      {/if}
    </CardList>
  </div>

  <!--
      Asciinema seems to be broken currently:
      https://github.com/asciinema/asciinema-player/issues/259
  -->
  <!-- {#if label.hasDemo}
    <AsciinemaPlayer castUrl="/projects/{label.slug}/demo.asciinema" />
  {/if} -->

  <!-- Show cards for the associations that want them -->
  <div id="association-cards">
    {#each filterAssociatedLabelsByDisplayType(data.globals, associatedLabels, classifier, 'card').items() as [assClass, assLabels] }
      <div class="association-cards-row">
        <h2>{getAssociationDisplayInfo(getClassifier(data.globals, assClass), classifier).title}:</h2>
        <CardGrid
          classifier={getClassifier(data.globals, assClass)}
          entries={assLabels.keys()}
          globals={data.globals}
        />
      </div>
    {/each}
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

  #links-list {
    width: 80%;
  }

  #association-cards {
    width: 80%;
  }

  input[type="submit"] {
    margin: 10px;
    width: 90%;
    height: 50px;
  }
</style>

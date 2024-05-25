<script lang="ts">
    import { Navbar, Markdown } from '$components';
    import { ChipList } from '$components/chip';
    import { CardGrid } from '$components/card';
    import OrdRec from '$lib/OrderedRecord';
    import { getAssociatedLabels, getClassifier } from '$lib/util';
    import { filterAssociatedLabelsByDisplayType, getAssociationDisplayInfo } from './associations';
    // import AsciinemaPlayer from "$components";

    export let data: import('./$types').PageData;

    $: classifier = OrdRec.fromItems(data.globals.classifiers).get(data.classifier);
    $: label = OrdRec.fromItems(classifier.labels).get(data.label);

    // List of associated labels, grouped by classifier
    $: associatedLabels = getAssociatedLabels(data.globals, label);
</script>

<Navbar
  path={[
    { url: classifier.slug, txt: classifier.info.name },
    { url: label.slug, txt: label.info.name },
  ]}
  globals={data.globals}
/>

<main>
  <div id="info-container">
    <Markdown source={label.readme} />
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
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
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

  #association-cards {
    width: 80%;
  }
</style>

<script lang="ts">
  import OrdRec from '$lib/OrderedRecord';
  import { getAssociatedLabels, getClassifier } from '$lib/util';
    import { Navbar, Markdown } from '$components';
    import { ChipList } from '$components/chip';
    import { CardGrid, IconCard, RepoCard, PackageCard, CardList } from '$components/card';
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
  <div class="paper">
    {#if label.info.banner}
      <img
        src="/{label.classifier}/{label.slug}/{label.info.banner}"
        alt="Banner for {label.info.name}"
        class="banner-image"
      />
    {/if}
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
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .paper {
    width: 80%;
    border-radius: 10px;
    box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.37);
  }
  @media only screen and (max-width: 600px) {
    .paper {
      width: 95%;
    }
  }

  #info-container {
    padding: 20px;
  }

  .banner-image {
    width: 100%;
    border-radius: 10px 10px 0 0;
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
</style>

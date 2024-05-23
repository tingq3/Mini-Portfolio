<script lang="ts">
    import { Navbar, Markdown } from '$components';
    import { ChipList } from '$components/chip';
    import OrdRec from '$lib/OrderedRecord';
    import { getAssociatedLabels } from '$lib/util';
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
    <ChipList labels={associatedLabels} link={true} />

    <Markdown source={label.readme} />
  </div>
  <!--
      Asciinema seems to be broken currently:
      https://github.com/asciinema/asciinema-player/issues/259
  -->
  <!-- {#if label.hasDemo}
    <AsciinemaPlayer castUrl="/projects/{label.slug}/demo.asciinema" />
  {/if} -->
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
</style>

<script lang="ts">
    import { Navbar, Markdown, Separator } from '$components';
    import { ChipList } from '$components/chip';
    import OrdRec, { type OrderedRecord } from '$lib/OrderedRecord';
    import type { ClassifierSlug, Label, LabelSlug } from '$types';
    // import AsciinemaPlayer from "$components";

    export let data: import('./$types').PageData;

    $: classifier = OrdRec.fromItems(data.globals.classifiers).get(data.classifier);
    $: label = OrdRec.fromItems(classifier.labels).get(data.label);

    // FIXME: This code is pretty much ENTIRELY copy-pasted from LabelCard
    // I need to move these things into helper functions in the lib somewhere
    // probably.
    // List of classifier slugs associated by this label
    $: usedClassifiers = OrdRec.fromItems(data.globals.classifiers).keys().filter(c => c in label.info.associations);
    // List of associated labels, grouped by classifier
    $: associatedLabels = OrdRec.fromRecord(
      // This feels absolutely disgusting but I simply cannot think of a nicer
      // way to do it
      Object.fromEntries(usedClassifiers.map(
        c => [
          c,
          OrdRec.fromRecord(
            Object.fromEntries(
              label.info.associations[c].map(slug => [
                slug,
                { label: OrdRec.fromItems(OrdRec.fromItems(data.globals.classifiers).get(c).labels).get(slug) }
              ]),
            ),
            label.info.associations[c],
          ),
        // Another manual type cast because Object.fromEntries is kinda stupid
        ] as [ClassifierSlug, OrderedRecord<LabelSlug, { label: Label}>]
      )),
      usedClassifiers,
    );
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

        <Markdown
            source={label.readme}
        />
    </div>
    <!--
        Asciinema seems to be broken currently:
        https://github.com/asciinema/asciinema-player/issues/259
    -->
    <!-- {#if data.info.hasDemo}
        <AsciinemaPlayer castUrl="/projects/{data.info.slug}/demo.asciinema" />
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

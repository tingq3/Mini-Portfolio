<script lang="ts">
import Background from '$components/Background.svelte';
import Markdown from '$components/markdown/Markdown.svelte';
import Navbar from '$components/navbar';
import consts from '$lib/consts';

export let data: import('./$types').PageData;

const mainInfo = `
# ${consts.APP_NAME}

This portfolio website is driven by ${consts.APP_NAME}, a
[free and open-source](https://en.wikipedia.org/wiki/Free_and_open-source_software)
data-driven portfolio system made with <3 by [Maddy Guthridge](https://maddyguthridge.com).

* [View the source code on GitHub](${consts.APP_GITHUB}).
* [Learn how to deploy your own instance of ${consts.APP_NAME}](${consts.APP_GITHUB}/blob/main/docs/Deploy.md).
* [View the GPLv3 software license for ${consts.APP_NAME}](${consts.APP_GITHUB}/blob/main/LICENSE.md).
`;

let technicalDetails = '';
if (data.versions) {
  technicalDetails = `

## Technical details

For security reasons, these details are only shown if you are logged in.

* ${consts.APP_NAME}: v${data.versions.site}
* Node: ${data.versions.node}
* OS: ${data.versions.os}
`;
}

const readme = mainInfo + technicalDetails;
</script>

<Navbar
  config={data.config}
  loggedIn={data.loggedIn}
  path={[
    { txt: 'About', url: 'about' },
  ]}
/>

<Background color={data.config.color} />

<main>
  <div>
    <Markdown source={readme} />
  </div>
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  main > div {
    min-width: 80%;
  }
</style>

import { readFile, writeFile } from 'fs/promises';
import { getDataDir } from './dataDir';

const DEFAULT_README = `
# Your portfolio

Welcome to your brand new data-driven portfolio website! You're reading the
site's \`README.md\`, which is shown as the site's landing page.

Go ahead and edit this file to give your users a nice landing page. You may
want to [learn Markdown](https://www.markdownguide.org/basic-syntax/).
`;

/** Path to README.md */
const README_MD = `${getDataDir()}/README.md`;

/** Return the readme file */
export async function getReadme(): Promise<string> {
  return readFile(README_MD, { encoding: 'utf-8' });
}

/** Update the readme file */
export async function setReadme(newReadme: string) {
  await writeFile(README_MD, newReadme);
}

/** Set up the default server README */
export async function initReadme() {
  await setReadme(DEFAULT_README);
}

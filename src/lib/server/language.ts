import { create } from 'superstruct';
import fs from 'node:fs/promises';
import { Language } from "$types";

const BASE = 'data/languages';


export async function getLanguageList() {
  const dirInfo = await fs.opendir(BASE);

  const projects = []

  for await (const entry of dirInfo) {
    if (entry.isDirectory()) {
      projects.push(entry.name);
    }
  }

  return projects;
}

/**
 * Load language info from its info.json file
 */
export async function getLanguageInfo(slug: string) {
  const info = await fs.readFile(`${BASE}/${slug}/info.json`);
  const proj = JSON.parse(info.toString());
  return create({ ...proj, slug }, Language);
}

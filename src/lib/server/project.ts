import { create } from 'superstruct';
import fs from 'node:fs/promises';
import { Project } from "$types";

const BASE = 'data/projects'


export async function getProjectsList() {
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
 * Load project info from its info.json file
 */
export async function getProjectInfo(slug: string) {
  const info = await fs.readFile(`${BASE}/${slug}/info.json`);
  const proj = JSON.parse(info.toString());
  return create({ ...proj, slug }, Project);
}

export async function getProjectReadme(slug: string) {
  const readme = await fs.readFile(`${BASE}/${slug}/README.md`);
  return readme.toString();
}

import fs from 'node:fs/promises';
import type { Project } from "$types";

const BASE = 'data/projects'

/**
 * Import project info from its index.ts file
 */
export async function getProjectInfo(slug: string) {
  const info = await fs.readFile(`${BASE}/${slug}/info.json`);
  return JSON.parse(info.toString()) as Project;
}

export async function getProjectReadme(slug: string) {
  const readme = await fs.readFile(`${BASE}/${slug}/README.md`);
  return readme.toString();
}

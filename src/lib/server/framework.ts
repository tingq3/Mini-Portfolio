import { create } from 'superstruct';
import fs from 'node:fs';
import path from 'node:path';
import { Framework, type TFramework, type TFrameworkMap } from '$types';
import { filterProjectsByFrameworks } from '$lib/util';
import { getProjectsAsArray } from './project';

const BASE = 'data/frameworks';

// Functions for loading data
// ==================================================

const frameworks: string[] = [];
const frameworkInfo: TFrameworkMap = {};

/**
 * Load list of available frameworks
 */
function loadFrameworkList() {
  const dirInfo = fs.readdirSync(BASE);

  for (const entry of dirInfo) {
    if (fs.statSync(path.join(BASE, entry)).isDirectory()) {
      frameworks.push(entry);
    }
  }
}

/**
 * Load framework info from its info.json file
 */
function loadFrameworkInfo(slug: string) {
  const info = fs.readFileSync(`${BASE}/${slug}/info.json`);
  const lang = JSON.parse(info.toString());
  frameworkInfo[slug] = create({
    ...lang,
    readme: loadFrameworkReadme(slug),
    slug,
  }, Framework);
}

/**
 * Load framework README.md
 */
function loadFrameworkReadme(slug: string) {
  const readme = fs.readFileSync(`${BASE}/${slug}/README.md`);
  return readme.toString();
}

export function reloadFrameworkData() {
  frameworks.length = 0;
  loadFrameworkList();
  for (const lang of frameworks) {
    loadFrameworkInfo(lang);
  }
  // Sort frameworks by usage frequency
  frameworks.sort((a, b) =>
    filterProjectsByFrameworks([b], getProjectsAsArray()).length -
    filterProjectsByFrameworks([a], getProjectsAsArray()).length
  );
}

// Functions for accessing data
// ==================================================

/**
 * Returns array of framework slugs, by default filtering out frameworks excluded
 * from the global list.
 */
export function getFrameworkSlugs(filter?: boolean): string[] {
  if (filter === false) {
    return frameworks;
  } else {
    return frameworks.filter(l => !getFrameworkInfo(l).exclude);
  }
}

export function getFrameworkInfo(slug: string): TFramework {
  return frameworkInfo[slug];
}

/**
 * Returns map of all framework info, including those excluded from those the
 * global list.
 */
export function getFrameworksAsMap() {
  return frameworkInfo;
}

/**
 * Returns array of all framework info, by default filtering out frameworks
 * excluded from the global list.
 */
export function getFrameworksAsArray(filter?: boolean) {
  return getFrameworkSlugs(filter).map(l => getFrameworkInfo(l));
}

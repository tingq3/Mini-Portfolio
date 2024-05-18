import { create } from 'superstruct';
import fs from 'node:fs';
import path from 'node:path';
import { Language, type TLanguage } from "$types";
import { filterProjectsByLanguages } from "$lib/util";
import { getProjectsAsArray } from './project';

const BASE = 'data/languages';

// Functions for loading data
//==================================================

const languages: string[] = [];
const languageInfo: Record<string, TLanguage> = {};

/**
 * Load list of available languages
 */
function loadLanguageList() {
  const dirInfo = fs.readdirSync(BASE);

  for (const entry of dirInfo) {
    if (fs.statSync(path.join(BASE, entry)).isDirectory()) {
      languages.push(entry);
    }
  }
}

/**
 * Load language info from its info.json file
 */
function loadLanguageInfo(slug: string) {
  const info = fs.readFileSync(`${BASE}/${slug}/info.json`);
  const proj = JSON.parse(info.toString());
  languageInfo[slug] = create({ ...proj, slug }, Language);
}

// Functions for accessing data
//==================================================

export function getLanguageSlugs(): string[] {
  return languages;
}

export function getLanguageInfo(slug: string): TLanguage {
  return languageInfo[slug];
}

export function getLanguagesAsMap() {
  return languageInfo;
}

export function getLanguagesAsArray() {
  return languages.map(l => getLanguageInfo(l));
}

// Load all language data
//==================================================

loadLanguageList();
for (const lang of languages) {
  loadLanguageInfo(lang);
}
// Sort languages by usage frequency
languages.sort((a, b) =>
  filterProjectsByLanguages([b], getProjectsAsArray()).length
  - filterProjectsByLanguages([a], getProjectsAsArray()).length
)

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
  const lang = JSON.parse(info.toString());
  languageInfo[slug] = create({ ...lang, slug }, Language);
}

export function reloadLanguageData() {
  languages.length = 0;
  loadLanguageList();
  for (const lang of languages) {
    loadLanguageInfo(lang);
  }
  // Sort languages by usage frequency
  languages.sort((a, b) =>
    filterProjectsByLanguages([b], getProjectsAsArray()).length
    - filterProjectsByLanguages([a], getProjectsAsArray()).length
  )
}

// Functions for accessing data
//==================================================

/**
 * Returns array of language slugs, skipping those excluded from the global
 * list.
 */
export function getLanguageSlugs(): string[] {
  return languages.filter(l => !getLanguageInfo(l).exclude);
}

export function getLanguageInfo(slug: string): TLanguage {
  return languageInfo[slug];
}

/**
 * Returns map of all language info, including those excluded from those the
 * global list.
 */
export function getLanguagesAsMap() {
  return languageInfo;
}

/**
 * Returns array of all language info, skipping those excluded from the global
 * list.
 */
export function getLanguagesAsArray() {
  return languages.map(l => getLanguageInfo(l)).filter(l => !l.exclude);
}

// Load all language data
//==================================================
reloadLanguageData();

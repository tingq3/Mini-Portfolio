import { getMainConfig } from '$lib/server/config';
import { getLanguagesAsArray, getLanguagesAsMap } from '$lib/server/language';
import { getProjectsAsArray } from '$lib/server/project';

export function load() {
  return {
    projects: getProjectsAsArray(),
    languages: getLanguagesAsArray(),
    languagesMap: getLanguagesAsMap(),
    config: getMainConfig(),
  };
}

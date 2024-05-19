import { getMainConfig } from '$lib/server/config';
import { getFrameworksAsMap } from '$lib/server/framework';
import { getLanguagesAsArray, getLanguagesAsMap } from '$lib/server/language';
import { getProjectsAsArray } from '$lib/server/project';

export function load() {
  return {
    projects: getProjectsAsArray(),
    languages: getLanguagesAsArray(),
    languagesMap: getLanguagesAsMap(),
    frameworksMap: getFrameworksAsMap(),
    config: getMainConfig(),
  };
}

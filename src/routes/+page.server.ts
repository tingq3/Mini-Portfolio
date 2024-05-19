import { getLanguagesAsArray } from '$lib/server/language';
import { getProjectsAsArray } from '$lib/server/project';

export function load() {
  return {
    projects: getProjectsAsArray(),
    languages: getLanguagesAsArray(),
  };
}

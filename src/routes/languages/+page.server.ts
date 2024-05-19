import { getMainConfig } from '$lib/server/config';
import { getLanguagesAsArray } from '$lib/server/language';

export function load() {
  return {
    languages: getLanguagesAsArray(false),
    config: getMainConfig(),
  };
}

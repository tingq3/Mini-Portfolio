import { getLanguagesAsArray } from "$lib/server/language";

export function load() {
  return {
    languages: getLanguagesAsArray(false),
  };
}

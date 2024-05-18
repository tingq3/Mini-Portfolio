import { getLanguagesAsMap } from "$lib/server/language";
import { getProjectInfo } from "$lib/server/project";

export function load({ params }: { params: { project: string }}) {
  return {
    info: getProjectInfo(params.project),
    languages: getLanguagesAsMap(),
  };
}

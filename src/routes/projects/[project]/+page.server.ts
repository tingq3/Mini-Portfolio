import { getLanguageInfo, getLanguageList } from "$lib/server/language";
import { getProjectReadme, getProjectInfo } from "$lib/server/project";
import type { TLanguage } from "$types";

export async function load({ params }: { params: { project: string }}) {
  const info = await getProjectInfo(params.project);
  const readme = await getProjectReadme(params.project);

  // FIXME: Duplicate code from main page.server.ts
  // Need a better way to have this data hang around (perhaps a global data
  // store file?)
  const languages: Record<string, TLanguage> = {};
  for (const l of await getLanguageList()) {
    languages[l] = await getLanguageInfo(l);
  }

  return {
    info,
    readme,
    languages,
  };
}

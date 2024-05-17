import { getLanguageInfo, getLanguageList } from "$lib/server/language";
import { getProjectInfo, getProjectsList } from "$lib/server/project";

export async function load() {
  // Projects
  const projects = [];
  for (const p of await getProjectsList()) {
    projects.push(await getProjectInfo(p));
  }
  projects.sort((a, b) => b.sort - a.sort);

  // Languages
  const languages = [];
  for (const l of await getLanguageList()) {
    languages.push(await getLanguageInfo(l));
  }

  return { projects, languages };
}

import type { TProject } from '$types';

export function filterProjectsByLanguages(langs: string[], projects: TProject[]) {
  return projects
    .filter(
      p => p.languages.find(l => langs.includes(l)) !==
      undefined
    );
}

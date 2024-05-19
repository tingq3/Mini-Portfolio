import type { TProject } from '$types';

export function filterProjectsByLanguages(langs: string[], projects: TProject[]) {
  return projects
    .filter(
      p => p.languages.find(l => langs.includes(l)) !==
      undefined
    );
}

export function filterProjectsByFrameworks(frameworks: string[], projects: TProject[]) {
  return projects
    .filter(
      p => p.frameworks.find(l => frameworks.includes(l)) !==
      undefined
    );
}

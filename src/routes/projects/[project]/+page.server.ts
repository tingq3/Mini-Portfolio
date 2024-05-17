import { getProjectReadme, getProjectInfo } from "$lib/server/project";

export async function load({ params }: { params: { project: string }}) {
  const info = await getProjectInfo(params.project);
  const readme = await getProjectReadme(params.project);

  return {
    info,
    readme,
  };
}

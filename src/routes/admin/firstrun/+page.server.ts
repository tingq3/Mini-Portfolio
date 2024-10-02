import { redirect } from '@sveltejs/kit';
import { serverIsSetUp } from '$lib/server/data/dataDir';

export async function load() {
  if (await serverIsSetUp()) {
    redirect(303, '/');
  }
  return {};
}

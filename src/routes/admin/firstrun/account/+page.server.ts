import { redirect } from '@sveltejs/kit';
import { authIsSetUp } from '$lib/server/data/dataDir';

export async function load() {
  if (await authIsSetUp()) {
    redirect(303, '/admin/firstrun/data');
  }
  return {};
}

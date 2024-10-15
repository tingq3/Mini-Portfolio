import { redirect } from '@sveltejs/kit';
import { authIsSetUp, dataIsSetUp } from '$lib/server/data/dataDir';

export async function load() {
  if (!await authIsSetUp()) {
    redirect(303, '/admin/firstrun/account');
  }
  if (await dataIsSetUp()) {
    redirect(303, '/');
  }
  return {};
}

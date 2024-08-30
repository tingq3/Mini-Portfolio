/** Admin endpoints */
import auth from './auth';
import config from './config';
import repo from './repo';
import firstrun from './firstrun';
import { apiFetch, json } from '$endpoints/fetch';

export async function refresh(token: string | undefined) {
  return await json(apiFetch('POST', '/api/admin/data/refresh', token)) as Record<string, never>;
}

export default function admin(token: string | undefined) {
  return {
    auth: auth(token),
    config: config(token),
    repo: repo(token),
    firstrun,
    data: {
      /** Refresh the data store */
      refresh: () => refresh(token),
    }
  };
}

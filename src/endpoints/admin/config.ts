/** Configuration endpoints */
import { apiFetch, json } from '../fetch';
import type { ConfigJson } from '$lib/server/data/config';

export default function config(token: string | undefined) {
  const get = async () => {
    return json(apiFetch(
      'GET',
      '/api/admin/config',
      token,
    )) as Promise<ConfigJson>;
  };

  const put = async (config: ConfigJson) => {
    return json(apiFetch(
      'PUT',
      '/api/admin/config',
      token,
      config,
    )) as Promise<Record<string, never>>;
  };

  return {
    /**
     * Retrieve the site configuration.
     *
     * @param token The authentication token
     */
    get,
    /**
     * Update the site configuration.
     *
     * @param token The authentication token
     * @param config The updated configuration
     */
    put,
  };
}

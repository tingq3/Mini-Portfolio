/** Configuration endpoints */
import { apiFetch, json } from '../fetch';
import type { ConfigJson } from '$lib/server/data/config';

/**
 * Retrieve the site configuration.
 *
 * @param token The authentication token
 */
export const get = async (token: string) => {
  return json(apiFetch(
    'GET',
    '/api/admin/config',
    token,
  )) as Promise<ConfigJson>;
};

/**
 * Update the site configuration.
 *
 * @param token The authentication token
 * @param config The updated configuration
 */
export const put = async (token: string, config: ConfigJson) => {
  return json(apiFetch(
    'PUT',
    '/api/admin/config',
    token,
    config,
  )) as Promise<Record<string, never>>;
};

const config = {
  get,
  put,
};

export default config;

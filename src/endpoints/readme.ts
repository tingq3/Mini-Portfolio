import { apiFetch, json } from './fetch';

/**
 * Get the readme.
 *
 * @returns the primary readme of the data repo
 */
export const get = async () => {
  return json(apiFetch(
    'GET',
    '/api/readme',
    undefined,
  )) as Promise<{ readme: string }>;
};

/**
 * Set the readme
 *
 * @param token Authorization token
 * @param readme new README file
 */
export const set = async (token: string, readme: string) => {
  return json(apiFetch(
    'PUT',
    '/api/readme',
    token,
    { readme },
  )) as Promise<Record<string, never>>;
};

export default {
  get,
  set,
};

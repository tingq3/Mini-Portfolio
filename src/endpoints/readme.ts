import { apiFetch } from './fetch';

/**
 * Get the readme.
 *
 * @returns the primary readme of the data repo
 */
export const get = async () => {
  return apiFetch(
    'GET',
    '/api/readme',
    undefined,
  ) as Promise<{ readme: string }>;
};

/**
 * Set the readme
 *
 * @param token Authorization token
 * @param readme new README file
 */
export const set = async (token: string, readme: string) => {
  return apiFetch(
    'PUT',
    '/api/readme',
    token,
    { readme },
  ) as Promise<Record<string, never>>;
};

export default {
  get,
  set,
};

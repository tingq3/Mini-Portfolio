import { apiFetch, json } from './fetch';

export default function readme(token: string | undefined) {
  const get = async () => {
    return json(apiFetch(
      'GET',
      '/api/readme',
      token,
    )) as Promise<{ readme: string }>;
  };

  const set = async (readme: string) => {
    return json(apiFetch(
      'PUT',
      '/api/readme',
      token,
      { readme },
    )) as Promise<Record<string, never>>;
  };

  return {
    /**
     * Get the readme.
     *
     * @returns the primary readme of the data repo
     */
    get,
    /**
     * Set the readme
     *
     * @param token Authorization token
     * @param readme new README file
     */
    set,
  };
}

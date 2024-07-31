/** Debug endpoints */
import { apiFetch } from './fetch';

/**
 * Reset the app to its default state.
 */
export const clear = async () => {
  return apiFetch(
    'DELETE',
    '/api/debug/clear',
    undefined,
  ) as Promise<Record<string, never>>;
};

const debug = {
  clear,
};

export default debug;

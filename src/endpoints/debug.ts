/** Debug endpoints */
import { apiFetch, json } from './fetch';

export default function debug(token: string | undefined) {
  const clear = async () => {
    return json(apiFetch(
      'DELETE',
      '/api/debug/clear',
      token,
    )) as Promise<Record<string, never>>;
  };

  const echo = async (text: string) => {
    return json(apiFetch(
      'POST',
      '/api/debug/echo',
      token,
      { text }
    )) as Promise<Record<string, never>>;
  };

  const dataRefresh = async () => {
    return json(apiFetch(
      'POST',
      '/api/debug/data/refresh',
      token,
    )) as Promise<Record<string, never>>;
  };

  return {
    /**
     * Reset the app to its default state.
     */
    clear,
    /**
     * Echo text to the server's console
     */
    echo,
    /**
     * Invalidate cached data
     */
    dataRefresh,
  };
}

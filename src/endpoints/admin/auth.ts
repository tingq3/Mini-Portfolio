/** Authentication endpoints */
import { apiFetch, json } from '../fetch';

export default function auth(token: string | undefined) {
  /**
   * Log in as an administrator for the site
   *
   * @param username The username of the admin account
   * @param password The password of the admin account
   */
  const login = async (username: string, password: string) => {
    return json(apiFetch(
      'POST',
      '/api/admin/auth/login',
      undefined,
      { username, password }
    )) as Promise<{ token: string }>;
  };

  /**
   * Log out, invalidating the token
   *
   * @param token The token to invalidate
   */
  const logout = async () => {
    return json(apiFetch(
      'POST',
      '/api/admin/auth/logout',
      token,
    ));
  };

  /**
   * Change the authentication of the admin account
   *
   * @param token The auth token
   * @param oldPassword The currently-active password
   * @param newPassword The new replacement password
   */
  const change = async (newUsername: string, oldPassword: string, newPassword: string) => {
    return json(apiFetch(
      'POST',
      '/api/admin/auth/change',
      token,
      { newUsername, oldPassword, newPassword }
    )) as Promise<Record<string, never>>;
  };

  /**
   * Revoke all current API tokens
   *
   * @param token The auth token
   */
  const revoke = async () => {
    return json(apiFetch(
      'POST',
      '/api/admin/auth/revoke',
      token
    )) as Promise<Record<string, never>>;
  };

  /**
   * Disable authentication, meaning that users can no-longer log into the
   * system.
   *
   * @param token The auth token
   * @param password The password to the admin account
   */
  const disable = async (username: string, password: string) => {
    return json(apiFetch(
      'POST',
      '/api/admin/auth/disable',
      token,
      { username, password }
    )) as Promise<Record<string, never>>;
  };

  return {
    login,
    logout,
    change,
    disable,
    revoke,
  };
}

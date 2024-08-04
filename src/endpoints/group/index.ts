/** Group management endpoints */
import type { GroupInfoBrief, GroupInfoFull } from '$lib/server/data/group';
import { apiFetch } from '../fetch';

/**
 * Return a list of groups
 *
 * @returns list of groups
 */
export const list = async () => {
  return apiFetch(
    'GET',
    '/api/group',
    undefined,
  ) as Promise<Record<string, GroupInfoBrief>>;
};

/**
 * Create a new group
 *
 * @param token The authentication token
 * @param name The name of the group
 * @returns An object containing the slug of the newly-created group.
 */
export const create = async (token: string, name: string) => {
  return apiFetch(
    'POST',
    '/api/group',
    token,
    { name },
  ) as Promise<{ slug: string }>;
};

/**
 * Return info on a particular group
 *
 * @param group The id of the group
 * @returns info about the group
 */
export const info = async (group: string) => {
  return apiFetch(
    'GET',
    `/api/group/${group}`,
    undefined,
  ) as Promise<GroupInfoFull>;
};

/**
 * Returns the README.md of the given group
 *
 * @param group group ID
 * @returns readme.md of group
 */
export const getReadme = async (group: string) => {
  return apiFetch(
    'PUT',
    `/api/group/${group}/readme`,
    undefined,
  ) as Promise<{ readme: string }>;
}

/**
 * Updates the README.md of the given group
 *
 * @param token Auth token
 * @param group group ID
 * @param readme README.md contents
 */
export const setReadme = async (token: string, group: string, readme: string) => {
  return apiFetch(
    'PUT',
    `/api/group/${group}/readme`,
    token,
    { readme },
  ) as Promise<Record<string, never>>;
}

const config = {
  list,
  create,
  info,
  getReadme,
  setReadme,
};

export default config;

/** Group management endpoints */
import type { GroupInfoBrief, GroupInfoFull } from '$lib/server/data/group';
import { apiFetch } from '../fetch';
import makeItemFunctions from './item';

/**
 * Return brief info about all groups
 *
 * @returns mappings of groups
 */
export const all = async () => {
  return apiFetch(
    'GET',
    '/api/group',
    undefined,
  ) as Promise<Record<string, GroupInfoBrief>>;
};

/** Access a group with the given ID */
export const withId = (groupId: string) => {
  const create = async (token: string, name: string, description: string) => {
    return apiFetch(
      'POST',
      `/api/group/${groupId}`,
      token,
      { name, description },
    ) as Promise<Record<string, never>>;
  };

  const remove = async (token: string) => {
    return apiFetch(
      'DELETE',
      `/api/group/${groupId}`,
      token,
    ) as Promise<Record<string, never>>;
  };

  const getInfo = async () => {
    return apiFetch(
      'GET',
      `/api/group/${groupId}`,
      undefined,
    ) as Promise<GroupInfoFull>;
  };

  const setInfo = async (token: string, newInfo: GroupInfoFull) => {
    return apiFetch(
      'PUT',
      `/api/group/${groupId}`,
      token,
      newInfo,
    ) as Promise<Record<string, never>>;
  };

  const getReadme = async () => {
    return apiFetch(
      'GET',
      `/api/group/${groupId}/readme`,
      undefined,
    ) as Promise<{ readme: string }>;
  };

  const setReadme = async (token: string, readme: string) => {
    return apiFetch(
      'PUT',
      `/api/group/${groupId}/readme`,
      token,
      { readme },
    ) as Promise<Record<string, never>>;
  };

  return {
    /**
     * Create a new group
     *
     * @param token The authentication token
     * @param name The name of the group
      * @param description The description of the group
     */
    create,
    /**
     * Remove a group
     *
     * @param token The authentication token
     */
    remove,
    info: {
      /**
       * Return info on a particular group
       *
       * @returns info about the group
       */
      get: getInfo,
      /**
       * Update info on a particular group
       *
       * @param info info about the group
       */
      set: setInfo,
    },
    readme: {
      /**
       * Returns the README.md of the given group
       *
       * @returns readme.md of group
       */
      get: getReadme,
      /**
       * Updates the README.md of the given group
       *
       * @param token Auth token
       * @param readme README.md contents
       */
      set: setReadme,
    },
    /** Access properties of items within this group */
    item: makeItemFunctions(groupId),
  };
};

const group = {
  all,
  withId,
};

export default group;

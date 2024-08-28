/** Group management endpoints */
import type { GroupInfo } from '$lib/server/data/group';
import { apiFetch, json } from '../fetch';
import makeItemFunctions from './item';

export default function group(token: string | undefined) {
  /**
   * Return brief info about all groups
   *
   * @returns mappings of groups
   */
  const all = async () => {
    return json(apiFetch(
      'GET',
      '/api/group',
      token,
    )) as Promise<Record<string, GroupInfo>>;
  };

  /** Access a group with the given ID */
  const withId = (groupId: string) => {
    const create = async (name: string, description: string) => {
      return json(apiFetch(
        'POST',
        `/api/group/${groupId}`,
        token,
        { name, description },
      )) as Promise<Record<string, never>>;
    };

    const remove = async () => {
      return json(apiFetch(
        'DELETE',
        `/api/group/${groupId}`,
        token,
      )) as Promise<Record<string, never>>;
    };

    const getInfo = async () => {
      return json(apiFetch(
        'GET',
        `/api/group/${groupId}`,
        token,
      )) as Promise<GroupInfo>;
    };

    const setInfo = async (newInfo: GroupInfo) => {
      return json(apiFetch(
        'PUT',
        `/api/group/${groupId}`,
        token,
        newInfo,
      )) as Promise<Record<string, never>>;
    };

    const getReadme = async () => {
      return json(apiFetch(
        'GET',
        `/api/group/${groupId}/readme`,
        token,
      )) as Promise<{ readme: string }>;
    };

    const setReadme = async (readme: string) => {
      return json(apiFetch(
        'PUT',
        `/api/group/${groupId}/readme`,
        token,
        { readme },
      )) as Promise<Record<string, never>>;
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
      item: makeItemFunctions(token, groupId),
    };
  };

  return {
    all,
    withId,
  };
}

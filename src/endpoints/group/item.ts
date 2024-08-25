/** Item management endpoints */

import { apiFetch } from '$endpoints/fetch';
import type { ItemInfoBrief, ItemInfoFull } from '$lib/server/data/item';

export default function makeItemFunctions(groupId: string) {
  /**
   * Return brief info about all items
   *
   * @returns mappings of items
   */
  const all = async () => {
    return apiFetch(
      'GET',
      `/api/group/${groupId}/item`,
      undefined,
    ) as Promise<Record<string, ItemInfoBrief>>;
  };

  const withId = (itemId: string) => {
    const create = async (token: string, name: string, description: string) => {
      return apiFetch(
        'POST',
        `/api/group/${groupId}/item/${itemId}`,
        token,
        { name, description },
      ) as Promise<Record<string, never>>;
    };

    const remove = async (token: string) => {
      return apiFetch(
        'DELETE',
        `/api/group/${groupId}/item/${itemId}`,
        token,
      ) as Promise<Record<string, never>>;
    };

    const getInfo = async () => {
      return apiFetch(
        'GET',
        `/api/group/${groupId}/item/${itemId}`,
        undefined,
      ) as Promise<ItemInfoFull>;
    };

    const setInfo = async (token: string, newInfo: ItemInfoFull) => {
      return apiFetch(
        'PUT',
        `/api/group/${groupId}/item/${itemId}`,
        token,
        newInfo,
      ) as Promise<Record<string, never>>;
    };

    const getReadme = async () => {
      return apiFetch(
        'GET',
        `/api/group/${groupId}/item/${itemId}/readme`,
        undefined,
      ) as Promise<{ readme: string }>;
    };

    const setReadme = async (token: string, readme: string) => {
      return apiFetch(
        'PUT',
        `/api/group/${groupId}/item/${itemId}/readme`,
        token,
        { readme },
      ) as Promise<Record<string, never>>;
    };

    const link = async (token: string, otherGroupId: string, otherItemId: string) => {
      return apiFetch(
        'POST',
        `/api/group/${groupId}/item/${itemId}/link`,
        token,
        { otherGroupId, otherItemId },
      ) as Promise<Record<string, never>>;
    };

    const unlink = async (token: string, otherGroupId: string, otherItemId: string) => {
      return apiFetch(
        'POST',
        `/api/group/${groupId}/item/${itemId}/unlink`,
        token,
        { otherGroupId, otherItemId },
      ) as Promise<Record<string, never>>;
    };

    return {
      /**
       * Create a new item
       *
       * @param token The authentication token
       * @param name The name of the item
       * @param description The description of the item
       */
      create,
      /**
       * Remove a item
       *
       * @param token The authentication token
       */
      remove,
      info: {
        /**
         * Return info on a particular item
         *
         * @returns info about the item
         */
        get: getInfo,
        /**
         * Update info on a particular item
         *
         * @param info info about the item
         */
        set: setInfo,
      },
      readme: {
        /**
         * Returns the README.md of the given item
         *
         * @returns readme.md of item
         */
        get: getReadme,
        /**
         * Updates the README.md of the given item
         *
         * @param token Auth token
         * @param readme README.md contents
         */
        set: setReadme,
      },
      /** Create a link between this item and another item */
      link,
      /** Remove a link between this item and another item */
      unlink,
    };
  };

  return {
    all,
    withId,
  };
}

/** Item management endpoints */

import { apiFetch } from '$endpoints/fetch';
import type { ItemInfoBrief } from '$lib/server/data/item';

export default function makeItemFunctions(groupId: string) {
  const all = async () => {
    return apiFetch(
      'GET',
      `/api/group/${groupId}/item`,
      undefined,
    ) as Promise<Record<string, ItemInfoBrief>>;
  };

  return {
    all,
  };
}

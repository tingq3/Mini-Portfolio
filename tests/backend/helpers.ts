import api, { type ApiClient } from '$endpoints';
import type { GroupInfo } from '$lib/server/data/group';
import type { ItemInfoFull } from '$lib/server/data/item';

/** Set up the server, returning (amongst other things) an API client */
export async function setup() {
  const credentials = (await api(undefined).admin.firstrun(null, null)).credentials;
  return {
    api: api(credentials.token),
    credentials,
  };
}

/** Create a group with the given ID */
export async function makeGroup(api: ApiClient, id: string) {
  await api.group.withId(id).create(id, id);
}

/** Creates custom group properties object */
export function createCustomGroupProperties(options: Partial<GroupInfo> = {}): GroupInfo {
  const group: GroupInfo = {
    name: 'My group',
    description: 'Group description',
    color: '#aa00aa',
    filterGroups: [],
    listedItems: [],
    banner: null,
    icon: null,
  };

  return { ...group, ...options };
}

/** Create an item with the given ID */
export async function makeItem(api: ApiClient, groupId: string, id: string) {
  await api.group.withId(groupId).item.withId(id).create(id, id);
}

/** Creates custom item properties object */
export function createCustomItemProperties(options: Partial<ItemInfoFull> = {}): ItemInfoFull {
  const item: ItemInfoFull = {
    name: 'My item',
    description: 'Item description',
    color: '#aa00aa',
    links: [],
    urls: {},
    banner: null,
    icon: null,
  };

  return { ...item, ...options };
}

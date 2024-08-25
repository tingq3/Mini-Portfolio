import api from '$endpoints';
import type { GroupInfo } from '$lib/server/data/group';
import type { ItemInfoFull } from '$lib/server/data/item';

/** Set up the server */
export async function setup() {
  return (await api.admin.firstrun(null, null)).credentials;
}

/** Create a group with the given ID */
export async function makeGroup(token: string, id: string) {
  await api.group.withId(id).create(token, id, id);
}

/** Creates custom group properties object */
export function createCustomGroupProperties(options: Partial<GroupInfo> = {}): GroupInfo {
  const group: GroupInfo = {
    name: 'My group',
    description: 'Group description',
    color: '#aa00aa',
    filterGroups: [],
    associations: [],
    listedItems: [],
    banner: null,
    icon: null,
  };

  return { ...group, ...options };
}

/** Create an item with the given ID */
export async function makeItem(token: string, groupId: string, id: string) {
  await api.group.withId(groupId).item.withId(id).create(token, id, id);
}

/** Creates custom item properties object */
export function createCustomItemProperties(options: Partial<ItemInfoFull> = {}): ItemInfoFull {
  const item: ItemInfoFull = {
    name: 'My item',
    description: 'Item description',
    color: '#aa00aa',
    chipLinks: [],
    cardLinks: [],
    urls: {},
    banner: null,
    icon: null,
  };

  return { ...item, ...options };
}

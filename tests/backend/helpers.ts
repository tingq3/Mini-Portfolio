import api, { type ApiClient } from '$endpoints';
import type { ConfigJson } from '$lib/server/data/config';
import type { GroupInfo } from '$lib/server/data/group';
import type { ItemInfoFull } from '$lib/server/data/item';
import { version } from '$app/environment';

/** Set up the server, returning (amongst other things) an API client */
export async function setup() {
  const credentials = (await api(undefined).admin.firstrun(null, null)).credentials;
  return {
    api: api(credentials.token),
    credentials,
  };
}

/** Create custom config.json object */
export function makeConfig(options: Partial<ConfigJson> = {}): ConfigJson {
  const config: ConfigJson = {
    siteName: 'My site',
    siteShortName: 'Site',
    siteDescription: 'This is the description for my site',
    siteKeywords: ['Keyword', 'Another keyword'],
    siteIcon: null,
    listedGroups: [],
    color: '#ffaaff',
    version,
  };

  return { ...config, ...options };
}

/** Create a group with the given ID */
export async function makeGroup(api: ApiClient, id: string) {
  await api.group.withId(id).create(id, id);
}

/** Creates custom group properties object */
export function makeGroupInfo(options: Partial<GroupInfo> = {}): GroupInfo {
  const group: GroupInfo = {
    name: 'My group',
    description: 'Group description',
    pageDescription: 'View this group page in the portfolio',
    keywords: [],
    color: '#aa00aa',
    filterGroups: [],
    listedItems: [],
    filterItems: [],
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
export function makeItemInfo(options: Partial<ItemInfoFull> = {}): ItemInfoFull {
  const item: ItemInfoFull = {
    name: 'My item',
    description: 'Item description',
    pageDescription: 'View this item page in the portfolio',
    keywords: [],
    color: '#aa00aa',
    links: [],
    urls: {
      docs: null,
      repo: null,
      site: null,
    },
    package: null,
    banner: null,
    icon: null,
  };

  return { ...item, ...options };
}

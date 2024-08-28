import { beforeEach, expect, it, describe } from 'vitest';
import { createCustomItemProperties, makeGroup, makeItem, setup } from '../../helpers';
import { invalidNames, validNames } from '../../consts';
import type { ApiClient } from '$endpoints';

let api: ApiClient;
let groupId: string;
let itemId: string;

beforeEach(async () => {
  api = (await setup()).api;
  groupId = 'group-id';
  itemId = 'item-id';
  await makeGroup(api, groupId);
  await makeItem(api, groupId, itemId);
});

it.each([
  { name: 'Get info', fn: () => api.group.withId(groupId).item.withId(itemId).info.get() },
  { name: 'Set info', fn: () => api.group.withId(groupId).item.withId(itemId).info.set(createCustomItemProperties()) },
])('Gives an error if the server is not set up ($name)', async ({ fn }) => {
  await api.debug.clear();
  await expect(fn())
    .rejects.toMatchObject({ code: 400 });
});

it('Gives an error for invalid tokens', async () => {
  await expect(api.withToken('invalid').group.withId(groupId).item.withId(itemId).info.set(createCustomItemProperties()))
    .rejects.toMatchObject({ code: 401 });
});

it.each([
  { name: 'Get info', fn: (id: string) => api.group.withId(groupId).item.withId(id).info.get() },
  { name: 'Set info', fn: (id: string) => api.group.withId(groupId).item.withId(id).info.set(createCustomItemProperties()) },
])("Gives an error if the item doesn't exist ($name)", async ({ fn }) => {
  await expect(fn('invalid'))
    .rejects.toMatchObject({ code: 404 });
});

it('Successfully updates the item info', async () => {
  const newInfo = createCustomItemProperties({ name: 'New name' });
  await expect(api.group.withId(groupId).item.withId(itemId).info.set(newInfo))
    .toResolve();
  await expect(api.group.withId(groupId).item.withId(itemId).info.get())
    .resolves.toStrictEqual(newInfo);
});

describe('Item name', () => {
  // Invalid item names
  it.each(invalidNames)('Rejects invalid item names ($case)', async ({ name }) => {
    await expect(api.group.withId(groupId).item.withId(itemId).info.set(createCustomItemProperties({ name })))
      .rejects.toMatchObject({ code: 400 });
  });

  // Valid item names
  it.each(validNames)('Allows valid item names ($case)', async ({ name }) => {
    await expect(api.group.withId(groupId).item.withId(itemId).info.set(createCustomItemProperties({ name })))
      .toResolve();
  });
});

import api from '$endpoints';
import { beforeEach, expect, it, describe } from 'vitest';
import { createCustomItemProperties, makeGroup, makeItem, setup } from '../../helpers';
import { invalidNames, validNames } from '../../consts';

let token: string;
let groupId: string;
let itemId: string;

beforeEach(async () => {
  token = (await setup()).token;
  groupId = 'group-id';
  itemId = 'item-id';
  await makeGroup(token, groupId);
  await makeItem(token, groupId, itemId);
});

it.each([
  { name: 'Get info', fn: () => api.group.withId(groupId).item.withId(itemId).info.get() },
  { name: 'Set info', fn: () => api.group.withId(groupId).item.withId(itemId).info.set(token, createCustomItemProperties()) },
])('Gives an error if the server is not set up ($name)', async ({ fn }) => {
  await api.debug.clear();
  await expect(fn())
    .rejects.toMatchObject({ code: 400 });
});

it('Gives an error for invalid tokens', async () => {
  await expect(api.group.withId(groupId).item.withId(itemId).info.set('invalid', createCustomItemProperties()))
    .rejects.toMatchObject({ code: 401 });
});

it.each([
  { name: 'Get info', fn: (id: string) => api.group.withId(groupId).item.withId(id).info.get() },
  { name: 'Set info', fn: (id: string) => api.group.withId(groupId).item.withId(id).info.set(token, createCustomItemProperties()) },
])("Gives an error if the item doesn't exist ($name)", async ({ fn }) => {
  await expect(fn('invalid'))
    .rejects.toMatchObject({ code: 404 });
});

it('Successfully updates the item info', async () => {
  const newInfo = createCustomItemProperties({ name: 'New name' });
  await expect(api.group.withId(groupId).item.withId(itemId).info.set(token, newInfo))
    .toResolve();
  await expect(api.group.withId(groupId).item.withId(itemId).info.get())
    .resolves.toStrictEqual(newInfo);
});

describe('Item name', () => {
  // Invalid item names
  it.each(invalidNames)('Rejects invalid item names ($case)', async ({ name }) => {
    await expect(api.group.withId(groupId).item.withId(itemId).info.set(token, createCustomItemProperties({ name })))
      .rejects.toMatchObject({ code: 400 });
  });

  // Valid item names
  it.each(validNames)('Allows valid item names ($case)', async ({ name }) => {
    await expect(api.group.withId(groupId).item.withId(itemId).info.set(token, createCustomItemProperties({ name })))
      .toResolve();
  });
});

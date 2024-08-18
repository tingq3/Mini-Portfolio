
import { beforeEach, describe, expect, it, test } from 'vitest';
import { makeGroup, setup } from '../../helpers';
import api from '$endpoints';
import { invalidIds, invalidNames, validIds, validNames } from '../../consts';
import type { ItemInfoFull } from '$lib/server/data/item';

let token: string;
const groupId = 'group';

beforeEach(async () => {
  token = (await setup()).token;
  await makeGroup(token, groupId);
});

describe('Sets up basic item properties', async () => {
  const itemId = 'my-item';
  let info: ItemInfoFull;
  beforeEach(async () => {
    await api.group.withId(groupId).item.withId(itemId).create(token, 'Item name', 'Item description');
    info = await api.group.withId(groupId).item.withId(itemId).info.get();
  });

  test('Name matches', () => {
    expect(info.name).toStrictEqual('Item name');
  });

  test('Description matches', () => {
    expect(info.description).toStrictEqual('Item description');
  });

  it('Chooses a random color for the item', () => {
    expect(info.color).toSatisfy((s: string) => /^#[0-9a-f]{6}$/.test(s));
  });

  it('Readme contains item name and item description', async () => {
    await expect(api.group.withId(groupId).item.withId(itemId).readme.get())
      .resolves.toStrictEqual({ readme: '# Item name\n\nItem description\n' });
  });
});

describe('Item ID', () => {
  // Invalid item IDs
  it.each(invalidIds)('Rejects invalid item IDs ($case)', async ({ id }) => {
    await expect(api.group.withId(groupId).item.withId(id).create(token, 'Item name', 'Item description'))
      .rejects.toMatchObject({ code: 400 });
  });

  // Valid item IDs
  it.each(validIds)('Allows valid item IDs ($case)', async ({ id }) => {
    await expect(api.group.withId(groupId).item.withId(id).create(token, 'Item name', 'Item description'))
      .toResolve();
  });

  it('Allows matching item IDs within different groups', async () => {
    await api.group.withId(groupId).item.withId('item-id').create(token, 'Item name', 'Item description');
    await makeGroup(token, 'other-group');
    await expect(api.group.withId('other-group').item.withId('item-id').create(token, 'Item name', 'Item description'))
      .toResolve();
  });

  it('Fails if a item with a matching ID already exists', async () => {
    await api.group.withId(groupId).item.withId('my-item').create(token, 'My item', '');
    // ID of this item matches
    await expect(api.group.withId(groupId).item.withId('my-item').create(token, 'My other item', ''))
      .rejects.toMatchObject({ code: 400 });
  });
});

describe('Item name', () => {
  // Invalid item names
  it.each(invalidNames)('Rejects invalid item names ($case)', async ({ name }) => {
    await expect(api.group.withId(groupId).item.withId('item-id').create(token, name, ''))
      .rejects.toMatchObject({ code: 400 });
  });

  // Valid item names
  it.each(validNames)('Allows valid item names ($case)', async ({ name }) => {
    await expect(api.group.withId(groupId).item.withId('item-id').create(token, name, ''))
      .toResolve();
  });
});

it("Fails if the group doesn't exist", async () => {
  await expect(api.group.withId('invalid').item.withId('item-id').create(token, 'My item', ''))
    .rejects.toMatchObject({ code: 404 });
});

it('Fails for invalid tokens', async () => {
  await expect(api.group.withId(groupId).item.withId('id').create('invalid token', 'My item', ''))
    .rejects.toMatchObject({ code: 401 });
});

it('Fails if the data is not set up', async () => {
  await api.debug.clear();
  await expect(api.group.withId(groupId).item.withId('id').create(token, 'My item', ''))
    .rejects.toMatchObject({ code: 400 });
});

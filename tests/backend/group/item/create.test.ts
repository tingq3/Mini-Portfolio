
import { beforeEach, describe, expect, it, test } from 'vitest';
import { makeGroup, setup } from '../../helpers';
import api from '$endpoints';
import type { ItemInfoFull } from '$lib/server/data/item';
import generateTestCases from '../creationCases';

// Generate repeated test cases between groups and items
describe('Generated test cases', () => {
  let token: string;
  const groupId = 'group-id';

  generateTestCases(
    'item',
    async () => {
      token = (await setup()).token;
      await api.group.withId(groupId).create(token, 'Group', '');
    },
    async (id: string, name: string, description: string) => {
      await api.group.withId(groupId).item.withId(id).create(token, name, description);
    }
  );
});

describe('Sets up basic item properties', async () => {
  let token: string;
  const groupId = 'group';

  beforeEach(async () => {
    token = (await setup()).token;
    await makeGroup(token, groupId);
  });
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
});

describe('Other test cases', async () => {
  let token: string;
  const groupId = 'group';

  beforeEach(async () => {
    token = (await setup()).token;
    await makeGroup(token, groupId);
  });

  it("Fails if the group doesn't exist", async () => {
    await expect(api.group.withId('invalid').item.withId('item-id').create(token, 'My item', ''))
      .rejects.toMatchObject({ code: 404 });
  });

  it('Fails for invalid tokens', async () => {
    await expect(api.group.withId(groupId).item.withId('id').create('invalid token', 'My item', ''))
      .rejects.toMatchObject({ code: 401 });
  });
});

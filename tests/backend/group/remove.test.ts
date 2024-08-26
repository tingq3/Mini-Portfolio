
import { describe, it, beforeEach, expect } from 'vitest';
import { createCustomItemProperties, makeGroup, makeItem, setup } from '../helpers';
import api from '$endpoints';
import generateTestCases from './removeCases';

describe('Generated test cases', () => {
  let token: string;

  generateTestCases(
    // Setup
    async () => {
      token = (await setup()).token;
    },
    // Create group
    async (id: string) => {
      await api.group.withId(id).create(token, 'Group', '');
    },
    // Get group info
    (id) => api.group.withId(id).info.get(),
    // Delete group
    id => api.group.withId(id).remove(token),
  );
});

describe('Other test cases', () => {
  let token: string;
  const group = 'my-group';

  beforeEach(async () => {
    token = (await setup()).token;
    await makeGroup(token, group);
  });

  it('Gives an error for invalid tokens', async () => {
    await expect(api.group.withId(group).remove('invalid'))
      .rejects.toMatchObject({ code: 401 });
  });

  it('Removes links to items in the group', async () => {
    await makeItem(token, group, 'item-1');
    await makeGroup(token, 'group-2');
    await makeItem(token, 'group-2', 'item-2');
    // Create the link
    await api.group.withId('group-2').item.withId('item-2').links.create(token, group, 'item-1');
    // Removing group removes link from group-2/item-2
    await api.group.withId(group).remove(token);
    await expect(api.group.withId('group-2').item.withId('item-2').info.get())
      .resolves.toMatchObject({
        // Links were removed
        links: [],
      });
  });

  /** Edge case: one-way links can be created by setting group info manually */
  it('Removes one-way links to this item', async () => {
    await makeItem(token, group, 'item-1');
    await makeGroup(token, 'group-2');
    await makeItem(token, 'group-2', 'item-2');
    // Create the link
    await api.group.withId('group-2').item.withId('item-2').info.set(
      token,
      createCustomItemProperties({
        links: [[{ groupId: group, style: 'chip' }, ['item-1']]],
      }),
    );
    // Removing group removes link from group-2/item-2
    await api.group.withId(group).remove(token);
    await expect(api.group.withId('group-2').item.withId('item-2').info.get())
      .resolves.toMatchObject({
        // Links were removed
        links: [],
      });
  });
});

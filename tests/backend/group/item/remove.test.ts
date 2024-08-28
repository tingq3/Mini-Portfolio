
import { describe, it, beforeEach, expect } from 'vitest';
import { createCustomItemProperties, makeGroup, makeItem, setup } from '../../helpers';
import type { ApiClient } from '$endpoints';
import generateTestCases from '../removeCases';

describe('Generated test cases', () => {
  let api: ApiClient;
  const groupId = 'group-id';

  generateTestCases(
    // Setup
    async () => {
      api = (await setup()).api;
      await makeGroup(api, groupId);
    },
    // Create group
    async (id: string) => {
      await api.group.withId(groupId).item.withId(id).create('Group', '');
    },
    // Get group info
    (id) => api.group.withId(groupId).item.withId(id).info.get(),
    // Delete group
    id => api.group.withId(groupId).item.withId(id).remove(),
  );
});

describe('Other test cases', () => {
  let api: ApiClient;
  const group = 'my-group';

  beforeEach(async () => {
    api = (await setup()).api;
    await makeGroup(api, group);
  });

  it('Gives an error for invalid tokens', async () => {
    await expect(api.withToken('invalid').group.withId(group).remove())
      .rejects.toMatchObject({ code: 401 });
  });

  it("Rejects if item's group was removed", async () => {
    await makeItem(api, group, 'item-id');
    await api.group.withId(group).remove();
    // Item was deleted too
    await expect(api.group.withId(group).item.withId('item-id').remove())
      .rejects.toMatchObject({ code: 404 });
  });

  it('Removes links to this item', async () => {
    await makeItem(api, group, 'item-1');
    await makeGroup(api, 'group-2');
    await makeItem(api, 'group-2', 'item-2');
    // Create the link
    await api.group.withId('group-2').item.withId('item-2').links.create(group, 'item-1');
    // Removing item removes link from group-2/item-2
    await api.group.withId(group).item.withId('item-1').remove();
    await expect(api.group.withId('group-2').item.withId('item-2').info.get())
      .resolves.toMatchObject({
        // Links were removed
        links: [],
      });
  });

  /** Edge case: one-way links can be created by setting group info manually */
  it('Removes one-way links to this item', async () => {
    await makeItem(api, group, 'item-1');
    await makeGroup(api, 'group-2');
    await makeItem(api, 'group-2', 'item-2');
    // Create the link
    await api.group.withId('group-2').item.withId('item-2').info.set(
      createCustomItemProperties({
        links: [[{ groupId: group, style: 'chip' }, ['item-1']]],
      }),
    );
    await api.group.withId(group).item.withId('item-1').remove();
    await expect(api.group.withId('group-2').item.withId('item-2').info.get())
      .resolves.toMatchObject({
        // Links were removed
        links: [],
      });
  });
});

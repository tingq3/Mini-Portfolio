
import { describe, it, beforeEach, expect } from 'vitest';
import { createCustomItemProperties, makeGroup, makeItem, setup } from '../../helpers';
import type { ApiClient } from '$endpoints';
import genRemoveTests from '../removeCases';
import genTokenTests from '../../tokenCase';

describe('Generated test cases', () => {
  let api: ApiClient;
  const groupId = 'group-id';

  genRemoveTests(
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
  const item = 'item-1';

  beforeEach(async () => {
    api = (await setup()).api;
    await makeGroup(api, group);
    await makeItem(api, group, item);
  });

  genTokenTests(
    () => api,
    api => api.group.withId(group).item.withId(item).remove(),
  );

  it("Rejects if item's group was removed", async () => {
    await api.group.withId(group).remove();
    // Item was deleted too
    await expect(api.group.withId(group).item.withId('item-id').remove())
      .rejects.toMatchObject({ code: 404 });
  });

  it('Removes links to this item', async () => {
    await makeGroup(api, 'group-2');
    await makeItem(api, 'group-2', 'item-2');
    // Create the link
    await api.group.withId('group-2').item.withId('item-2').links.create(group, item);
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
    await makeGroup(api, 'group-2');
    await makeItem(api, 'group-2', 'item-2');
    // Create the link
    await api.group.withId('group-2').item.withId('item-2').info.set(
      createCustomItemProperties({
        links: [[{ groupId: group, style: 'chip', title: group }, [item]]],
      }),
    );
    await api.group.withId(group).item.withId(item).remove();
    await expect(api.group.withId('group-2').item.withId('item-2').info.get())
      .resolves.toMatchObject({
        // Links were removed
        links: [],
      });
  });
});

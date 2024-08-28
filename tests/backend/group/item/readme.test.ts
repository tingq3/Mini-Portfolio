import { beforeEach, expect, it, describe } from 'vitest';
import { makeGroup, makeItem, setup } from '../../helpers';
import genReadmeTests from '../../readmeCases';
import { readFile } from 'fs/promises';
import { getDataDir } from '$lib/server/data/dataDir';
import type { ApiClient } from '$endpoints';
import genTokenTests from '../../tokenCase';

describe('Generated test cases', () => {
  let api: ApiClient;
  let groupId: string;
  let itemId: string;

  genReadmeTests(
    // Setup
    async () => {
      api = (await setup()).api;
      groupId = 'group-id';
      itemId = 'item-id';
      await makeGroup(api, groupId);
      await makeItem(api, groupId, itemId);
    },
    // Get readme
    () => api.group.withId(groupId).item.withId(itemId).readme.get(),
    // Set readme
    async (newReadme) => {
      await api.group.withId(groupId).item.withId(itemId).readme.set(newReadme);
    },
    // Get readme from disk
    () => readFile(`${getDataDir()}/${groupId}/${itemId}/README.md`, { encoding: 'utf-8' }),
  );
});

describe('Other cases', () => {
  let api: ApiClient;
  const groupId = 'group-id';
  const itemId = 'item-id';

  beforeEach(async () => {
    api = (await setup()).api;
    await makeGroup(api, groupId);
    await makeItem(api, groupId, itemId);
  });

  it("Errors if the group doesn't exist", async () => {
    await expect(api.group.withId('invalid-group').item.withId(itemId).readme.set('New readme'))
      .rejects.toMatchObject({ code: 404 });
  });

  it("Errors if the item doesn't exist", async () => {
    await expect(api.group.withId(groupId).item.withId('invalid-item').readme.set('New readme'))
      .rejects.toMatchObject({ code: 404 });
  });

  genTokenTests(
    () => api,
    api => api.group.withId(groupId).item.withId(itemId).readme.set('New readme'),
  );
});

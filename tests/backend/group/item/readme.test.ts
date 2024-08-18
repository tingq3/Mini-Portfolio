import api from '$endpoints';
import { beforeEach, expect, it, describe } from 'vitest';
import { makeGroup, makeItem, setup } from '../../helpers';
import generateTestCases from '../readmeCases';
import { readFile } from 'fs/promises';
import { getDataDir } from '$lib/server/data/dataDir';

describe('Generated test cases', () => {
  let token: string;
  let groupId: string;
  let itemId: string;

  generateTestCases(
    async () => {
      token = (await setup()).token;
      groupId = 'group-id';
      itemId = 'item-id';
      await makeGroup(token, groupId);
      await makeItem(token, groupId, itemId);
      return { token, data: { groupId, itemId } };
    },
    data => api.group.withId(data.groupId).item.withId(data.itemId).readme.get(),
    async (token, data, newReadme) => {
      await api.group.withId(data.groupId).item.withId(data.itemId).readme.set(token, newReadme);
    },
    data => readFile(`${getDataDir()}/${data.groupId}/${data.itemId}/README.md`, { encoding: 'utf-8' }),
  );
});

describe('Other cases', () => {
  let token: string;
  const groupId = 'group-id';
  const itemId = 'item-id';

  beforeEach(async () => {
    token = (await setup()).token;
    await makeGroup(token, groupId);
    await makeItem(token, groupId, itemId);
  });

  it("Errors if the group doesn't exist", async () => {
    await expect(api.group.withId('invalid-group').item.withId(itemId).readme.set(token, 'New readme'))
      .rejects.toMatchObject({ code: 404 });
  });

  it("Errors if the item doesn't exist", async () => {
    await expect(api.group.withId(groupId).item.withId('invalid-item').readme.set(token, 'New readme'))
      .rejects.toMatchObject({ code: 404 });
  });
});

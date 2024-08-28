import type { ApiClient } from '$endpoints';
import { beforeEach, describe, expect, it } from 'vitest';
import { makeGroup, setup } from '../helpers';
import generateTestCases from '../readmeCases';
import { readFile } from 'fs/promises';
import { getDataDir } from '$lib/server/data/dataDir';

describe('Generated test cases', () => {
  let api: ApiClient;
  const groupId = 'group-id';

  generateTestCases(
    // Setup
    async () => {
      api = (await setup()).api;
      await makeGroup(api, groupId);
    },
    // Get readme
    () => api.group.withId(groupId).readme.get(),
    // Set readme
    async (newReadme) => {
      await api.group.withId(groupId).readme.set(newReadme);
    },
    // Get readme from disk
    () => readFile(`${getDataDir()}/${groupId}/README.md`, { encoding: 'utf-8' }),
  );
});

describe('Other test cases', () => {
  let api: ApiClient;
  const groupId = 'group-id';

  beforeEach(async () => {
    api = (await setup()).api;
    await makeGroup(api, groupId);
  });

  it("Errors if the group doesn't exist", async () => {
    await expect(api.group.withId('invalid-group').readme.set('New readme'))
      .rejects.toMatchObject({ code: 404 });
  });

  it('Rejects README updates for invalid tokens', async () => {
    await expect(api.withToken('invalid').group.withId(groupId).readme.set('New readme'))
      .rejects.toMatchObject({ code: 401 });
  });
});

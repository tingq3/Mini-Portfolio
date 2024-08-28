import api, { type ApiClient } from '$endpoints';
import { beforeEach, describe, expect, it, test } from 'vitest';
import { makeGroup, setup } from './helpers';
import generateTestCases from './readmeCases';
import { readFile } from 'fs/promises';
import { getDataDir } from '$lib/server/data/dataDir';

describe('Generated test cases', () => {
  let api: ApiClient;
  generateTestCases(
    // Setup
    async () => {
      api = (await setup()).api;
    },
    // Get readme
    () => api.readme.get(),
    // Set readme
    async (newReadme) => {
      await api.readme.set(newReadme);
    },
    // Get readme from disk
    () => readFile(`${getDataDir()}/README.md`, { encoding: 'utf-8' }),
  );
});

describe('Other test cases', () => {
  let api: ApiClient;
  const groupId = 'group-id';

  beforeEach(async () => {
    api = (await setup()).api;
    await makeGroup(api, groupId);
  });

  test('The readme is set up by default', async () => {
    await expect(api.readme.get()).resolves.toMatchObject({ readme: expect.any(String) });
  });

  it('Rejects README updates for invalid tokens', async () => {
    await expect(api.withToken(undefined).readme.set('New readme'))
      .rejects.toMatchObject({ code: 401 });
  });
});

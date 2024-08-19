import api from '$endpoints';
import { beforeEach, describe, expect, it, test } from 'vitest';
import { makeGroup, setup } from './helpers';
import generateTestCases from './readmeCases';
import { readFile } from 'fs/promises';
import { getDataDir } from '$lib/server/data/dataDir';

describe('Generated test cases', () => {
  let token: string;
  generateTestCases(
    // Setup
    async () => {
      token = (await setup()).token;
    },
    // Get readme
    () => api.readme.get(),
    // Set readme
    async (newReadme) => {
      await api.readme.set(token, newReadme);
    },
    // Get readme from disk
    () => readFile(`${getDataDir()}/README.md`, { encoding: 'utf-8' }),
  );
});

describe('Other test cases', () => {
  let token: string;
  const groupId = 'group-id';

  beforeEach(async () => {
    token = (await setup()).token;
    await makeGroup(token, groupId);
  });

  test('The readme is set up by default', async () => {
    await expect(api.readme.get()).resolves.toMatchObject({ readme: expect.any(String) });
  });

  it('Rejects README updates for invalid tokens', async () => {
    await expect(api.readme.set('invalid token', 'New readme'))
      .rejects.toMatchObject({ code: 401 });
  });
});

import type { ApiClient } from '$endpoints';
import { beforeEach, describe, expect, it, test } from 'vitest';
import { setup } from './helpers';
import genReadmeTests from './readmeCases';
import { readFile } from 'fs/promises';
import { getDataDir } from '$lib/server/data/dataDir';
import genTokenTests from './tokenCase';

describe('Generated test cases', () => {
  let api: ApiClient;
  genReadmeTests(
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

  beforeEach(async () => {
    const res = await setup();
    api = res.api;
  });

  test('The readme is set up by default', async () => {
    await expect(api.readme.get()).resolves.toMatchObject({ readme: expect.any(String) });
  });

  genTokenTests(
    () => api,
    api => api.readme.set('New readme'),
  );
});

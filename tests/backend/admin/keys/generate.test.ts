/**
 * Test cases for generating a public key.
 */
import api, { type ApiClient } from '$endpoints';
import { beforeEach, describe, expect, test } from 'vitest';
import { setup } from '../../helpers';
import genTokenTests from '../../tokenCase';
import { getPrivateDataDir } from '$lib/server/data/dataDir';

// Fails due to broken setup workflow
test('key can be generated before server is set up', { fails: true }, async () => {
  await expect(api().admin.keys.generate()).toResolve();
});

test('Key is generated when requested', async () => {
  const { api } = await setup();
  await expect(api.admin.keys.generate()).resolves
    .toStrictEqual({ publicKey: expect.any(String), keyPath: expect.any(String) });
});

test('Generated keys are stored within the private data directory', async () => {
  const { api } = await setup();
  const keyPath = await api.admin.keys.generate().then(res => res.keyPath);
  // Path to key file should be entirely contained within private data dir
  expect(keyPath.startsWith(getPrivateDataDir())).toBeTrue();
});

describe('Token tests', () => {
  let api: ApiClient;
  beforeEach(async () => {
    api = (await setup()).api;
  });

  genTokenTests(
    () => api,
    api => api.admin.keys.get(),
  );
});

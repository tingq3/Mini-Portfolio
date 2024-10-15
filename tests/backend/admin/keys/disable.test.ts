/**
 * Test cases for disabling key-based authentication for git operations.
 */
import { beforeEach, describe, expect, it } from 'vitest';
import { setup } from '../../helpers';
import genTokenTests from '../../tokenCase';
import api, { type ApiClient } from '$endpoints';


it('Allows key-based authentication to be disabled', async () => {
  const { api } = await setup();
  await expect(api.admin.keys.disable()).resolves.toStrictEqual({});
  // Side effect: querying auth info gives null
  await expect(api.admin.keys.get()).resolves.toStrictEqual({
    publicKey: null,
    keyPath: null,
  });
});

// Fails due to setup process, which will be fixed soon
it('Allows token-less usage before server is set up', { fails: true }, async () => {
  await expect(api().admin.keys.disable()).resolves.toStrictEqual({});
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

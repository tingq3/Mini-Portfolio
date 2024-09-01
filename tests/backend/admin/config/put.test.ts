/**
 * Test cases for PUT /api/admin/config
 *
 * Allows users to edit the site configuration
 */
import { beforeEach, expect, it } from 'vitest';
import { makeConfig, setup } from '../../helpers';
import { version } from '$app/environment';
import type { ApiClient } from '$endpoints';

let api: ApiClient;

beforeEach(async () => {
  api = (await setup()).api;
});

it('Updates the current config contents', async () => {
  const newConfig = makeConfig();
  await expect(api.admin.config.put(newConfig)).resolves.toStrictEqual({});
  // Config should have updated
  await expect(api.admin.config.get()).resolves.toStrictEqual(newConfig);
});

it('Errors if the new config has an incorrect version', async () => {
  await expect(api.admin.config.put(makeConfig({ version: version + 'invalid' })))
    .rejects.toMatchObject({ code: 400 });
});

it('Errors if listedGroups contains non-existent groups', async () => {
  await expect(api.admin.config.put(makeConfig({ listedGroups: ['invalid'] })))
    .rejects.toMatchObject({ code: 400 });
});

it('Allows listedGroups to contain existing groups', async () => {
  await api.group.withId('my-group').create('my-group', '');
  await expect(api.admin.config.put(makeConfig({ listedGroups: ['my-group'] })))
    .resolves.toStrictEqual({});
  // Config should have updated
  await expect(api.admin.config.get())
    .resolves.toMatchObject({ listedGroups: ['my-group'] });
});

it('Rejects invalid tokens', async () => {
  await expect(api.withToken('invalid').admin.config.put(makeConfig()))
    .rejects.toMatchObject({ code: 401 });
});

it('Errors if site is not set up', async () => {
  await api.debug.clear();
  await expect(api.admin.config.put(makeConfig())).rejects.toMatchObject({ code: 400 });
});

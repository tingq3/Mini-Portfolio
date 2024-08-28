/**
 * Test cases for PUT /api/admin/config
 *
 * Allows users to edit the site configuration
 */
import { beforeEach, expect, it } from 'vitest';
import { setup } from '../../helpers';
import consts from '$lib/consts';
import type { ApiClient } from '$endpoints';

let api: ApiClient;

beforeEach(async () => {
  api = (await setup()).api;
});

it('Updates the current config contents', async () => {
  await expect(api.admin.config.put({
    siteName: 'Name changed',
    listedGroups: [],
    color: '#ffaaff',
    version: consts.VERSION,
  })).resolves.toStrictEqual({});
  // Config should have updated
  await expect(api.admin.config.get()).resolves.toStrictEqual({
    siteName: 'Name changed',
    listedGroups: [],
    color: '#ffaaff',
    version: consts.VERSION,
  });
});

it('Errors if the new config has an incorrect version', async () => {
  await expect(api.admin.config.put({
    siteName: 'Name changed',
    listedGroups: [],
    color: '#ffaaff',
    version: consts.VERSION + 'invalid',
  })).rejects.toMatchObject({ code: 400 });
});

it('Errors if the new config has references a non-existent page group', async () => {
  await expect(api.admin.config.put({
    siteName: 'Name changed',
    listedGroups: ['invalid'],
    color: '#ffaaff',
    version: consts.VERSION,
  })).rejects.toMatchObject({ code: 400 });
});

it('Can set pages as a main page group', async () => {
  await api.group.withId('my-group').create('my-group', '');
  await expect(api.admin.config.put({
    siteName: 'Name changed',
    listedGroups: ['my-group'],
    color: '#ffaaff',
    version: consts.VERSION,
  })).resolves.toStrictEqual({});
  // Config should have updated
  await expect(api.admin.config.get())
    .resolves.toMatchObject({ listedGroups: ['my-group'] });
});

it('Rejects invalid tokens', async () => {
  await expect(api.withToken('invalid').admin.config.put({
    siteName: 'Name changed',
    listedGroups: [],
    color: '#ffaaff',
    version: consts.VERSION,
  })).rejects.toMatchObject({ code: 401 });
});

it('Errors if site is not set up', async () => {
  await api.debug.clear();
  await expect(api.admin.config.put({
    siteName: 'Name changed',
    listedGroups: [],
    color: '#ffaaff',
    version: consts.VERSION,
  })).rejects.toMatchObject({ code: 400 });
});

/** Test cases to ensure pages load correctly */

import { beforeEach, expect, test } from 'vitest';
import endpoints from './endpoints';
import type { ApiClient } from '$endpoints';
import { setup } from '../backend/helpers';

let api: ApiClient;

beforeEach(async () => {
  api = (await setup()).api;
});

test('Homepage loads', async () => {
  await expect(endpoints.root()).resolves.toStrictEqual(expect.any(String));
});

test('Group page loads', async () => {
  await api.group.withId('my-group').create('My group', 'My group');
  await expect(endpoints.group('my-group')).resolves.toStrictEqual(expect.any(String));
});

test('Item page loads', async () => {
  await api.group.withId('my-group').create('My group', 'My group');
  await api.group.withId('my-group').item.withId('my-item').create('My item', 'My item');
  await expect(endpoints.item('my-group', 'my-item')).resolves.toStrictEqual(expect.any(String));
});

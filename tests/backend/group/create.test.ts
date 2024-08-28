
import { beforeEach, describe, expect, it, test } from 'vitest';
import { setup } from '../helpers';
import api, { type ApiClient } from '$endpoints';
import type { GroupInfo } from '$lib/server/data/group';
import generateTestCases from './creationCases';

// Generate repeated test cases between groups and items
describe('Generated test cases', () => {
  let api: ApiClient;

  generateTestCases(
    'group',
    async () => {
      api = (await setup()).api;
    },
    async (id: string, name: string, description: string) => {
      await api.group.withId(id).create(name, description);
    }
  );
});

describe('Sets up basic group properties', async () => {
  let api: ApiClient;
  const groupId = 'my-group';
  let info: GroupInfo;
  beforeEach(async () => {
    api = (await setup()).api;
    await api.group.withId(groupId).create('Group name', 'Group description');
    info = await api.group.withId(groupId).info.get();
  });

  test('Name matches', () => {
    expect(info.name).toStrictEqual('Group name');
  });

  test('Description matches', () => {
    expect(info.description).toStrictEqual('Group description');
  });

  it('Chooses a random color for the group', () => {
    expect(info.color).toSatisfy((s: string) => /^#[0-9a-f]{6}$/.test(s));
  });
});

describe('Other test cases', () => {
  beforeEach(async () => {
    // Currently no need for tokens, but may add later
    await setup();
  });

  it('Fails for invalid tokens', async () => {
    await expect(api('invalid').group.withId('id').create('My group', ''))
      .rejects.toMatchObject({ code: 401 });
  });
});

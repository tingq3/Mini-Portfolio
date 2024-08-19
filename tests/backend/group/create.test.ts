
import { beforeEach, describe, expect, it, test } from 'vitest';
import { setup } from '../helpers';
import api from '$endpoints';
import type { GroupInfo } from '$lib/server/data/group';
import generateTestCases from './creationCases';

// Generate repeated test cases between groups and items
describe('Generated test cases', () => {
  let token: string;

  generateTestCases(
    'group',
    async () => {
      token = (await setup()).token;
    },
    async (id: string, name: string, description: string) => {
      await api.group.withId(id).create(token, name, description);
    }
  );
});

describe('Sets up basic group properties', async () => {
  let token: string;
  const groupId = 'my-group';
  let info: GroupInfo;
  beforeEach(async () => {
    token = (await setup()).token;
    await api.group.withId(groupId).create(token, 'Group name', 'Group description');
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
    await expect(api.group.withId('id').create('invalid token', 'My group', ''))
      .rejects.toMatchObject({ code: 401 });
  });
});

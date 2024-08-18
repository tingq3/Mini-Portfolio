
import { beforeEach, describe, expect, it, test } from 'vitest';
import { setup } from '../helpers';
import api from '$endpoints';
import type { GroupInfoFull } from '$lib/server/data/group';
import generateTestCases from './creationCases';

// Generate repeated test cases between groups and items
generateTestCases(
  'group',
  async () => (await setup()).token,
  async (token: string, id: string, name: string, description: string) => {
    await api.group.withId(id).create(token, name, description);
  }
);

describe('Sets up basic group properties', async () => {
  let token: string;
  const groupId = 'my-group';
  let info: GroupInfoFull;
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

  it('Readme contains group name and group description', async () => {
    await expect(api.group.withId(groupId).readme.get())
      .resolves.toStrictEqual({ readme: '# Group name\n\nGroup description\n' });
  });
});

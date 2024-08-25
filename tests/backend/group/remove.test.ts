
import { describe, it, beforeEach, expect } from 'vitest';
import { makeGroup, setup } from '../helpers';
import api from '$endpoints';
import generateTestCases from './removeCases';

describe('Generated test cases', () => {
  let token: string;

  generateTestCases(
    // Setup
    async () => {
      token = (await setup()).token;
    },
    // Create group
    async (id: string) => {
      await api.group.withId(id).create(token, 'Group', '');
    },
    // Get group info
    (id) => api.group.withId(id).info.get(),
    // Delete group
    id => api.group.withId(id).remove(token),
  );
});

describe('Other test cases', () => {
  let token: string;
  const group = 'my-group';

  beforeEach(async () => {
    token = (await setup()).token;
    await makeGroup(token, group);
  });

  it('Gives an error for invalid tokens', async () => {
    await expect(api.group.withId(group).remove('invalid'))
      .rejects.toMatchObject({ code: 401 });
  });

  it.todo('Removes links to all items in the group');
});

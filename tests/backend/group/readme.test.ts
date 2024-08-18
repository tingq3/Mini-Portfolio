import api from '$endpoints';
import { beforeEach, describe, expect, it } from 'vitest';
import { makeGroup, setup } from '../helpers';
import generateTestCases from './readmeCases';
import { readFile } from 'fs/promises';
import { getDataDir } from '$lib/server/data/dataDir';

describe('Generated test cases', () => {
  let token: string;
  let groupId: string;

  generateTestCases(
    async () => {
      token = (await setup()).token;
      groupId = 'group-id';
      await makeGroup(token, groupId);
      return { token, data: groupId };
    },
    data => api.group.withId(data).readme.get(),
    async (token, data, newReadme) => {
      await api.group.withId(data).readme.set(token, newReadme);
    },
    data => readFile(`${getDataDir()}/${data}/README.md`, { encoding: 'utf-8' }),
  );
});

describe('Other test cases', () => {
  let token: string;
  let groupId: string;

  beforeEach(async () => {
    token = (await setup()).token;
    groupId = 'group';
    await makeGroup(token, groupId);
  });

  it("Errors if the group doesn't exist", async () => {
    await expect(api.group.withId('invalid-group').readme.set(token, 'New readme'))
      .rejects.toMatchObject({ code: 404 });
  });
});

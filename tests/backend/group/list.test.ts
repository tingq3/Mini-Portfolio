
import { it, expect, test } from 'vitest';
import { makeGroup, setup } from '../helpers';
import api from '$endpoints';
import gitRepos from '../gitRepos';

test('No groups exist by default', async () => {
  await setup();
  await expect(api.group.all()).resolves.toStrictEqual({});
});

it('Lists existing groups', async () => {
  const { token } = await setup();
  await makeGroup(token, 'my-group');
  await expect(api.group.all()).resolves.toStrictEqual({
    'my-group': {
      color: expect.any(String),
      description: 'my-group',
      name: 'my-group',
    },
  });
});

it('Ignores the .git directory', async () => {
  await api.admin.firstrun(gitRepos.TEST_REPO_RW, null);
  await expect(api.group.all()).resolves.toStrictEqual({});
});

it("Errors when the server hasn't been set up", async () => {
  await expect(api.group.all()).rejects.toMatchObject({ code: 400 });
});

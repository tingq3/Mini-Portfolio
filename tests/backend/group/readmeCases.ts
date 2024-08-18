/** Shared test cases for getting/setting the readme files of items */

import api from '$endpoints';
import { beforeEach, expect, it } from 'vitest';

export default function generateTestCases<T>(
  setup: () => Promise<{token: string, data: T}>,
  getReadme: (setupData: T) => Promise<{ readme: string }>,
  setReadme: (token: string, setupData: T, newReadme: string) => Promise<void>,
  getReadmeFromDisk: (setupData: T) => Promise<string>
) {
  let token: string;
  let setupData: T;

  beforeEach(async () => {
    const res = await setup();
    token = res.token;
    setupData = res.data;
  });

  it.each([
    { name: 'Get readme', fn: () => getReadme(setupData) },
    { name: 'Set readme', fn: () => setReadme(token, setupData, 'New readme') },
  ])('Errors if the server is not set up ($name)', async ({ fn }) => {
    await api.debug.clear();
    await expect(fn())
      .rejects.toMatchObject({ code: 400 });
  });

  it('Rejects README updates for invalid tokens', async () => {
    await expect(setReadme('invalid', setupData, 'New readme'))
      .rejects.toMatchObject({ code: 401 });
  });

  it('Correctly updates the readme contents', async () => {
    await expect(setReadme(token, setupData, 'New readme'))
      .toResolve();
    // API shows it correctly
    await expect(getReadme(setupData))
      .resolves.toStrictEqual({ readme: 'New readme' });
    // Stored correctly on the disk
    await expect(getReadmeFromDisk(setupData)).resolves.toStrictEqual('New readme');
  });
}

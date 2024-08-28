/** Shared test cases for getting/setting the readme files of items/groups */

import api from '$endpoints';
import { beforeEach, expect, it } from 'vitest';

/**
 * Generate shared test cases for getting/setting the readme of a group or
 * item.
 *
 * Similar design to `generateTestCases` from `creationCases.ts`, see that
 * documentation for usage.
 */
export default function generateTestCases<T>(
  setup: () => Promise<void>,
  getReadme: () => Promise<{ readme: string }>,
  setReadme: (newReadme: string) => Promise<void>,
  getReadmeFromDisk: () => Promise<string>
) {
  beforeEach(async () => { await setup(); });

  it.each([
    { name: 'Get readme', fn: () => getReadme() },
    { name: 'Set readme', fn: () => setReadme('New readme') },
  ])('Errors if the server is not set up ($name)', async ({ fn }) => {
    await api().debug.clear();
    await expect(fn())
      .rejects.toMatchObject({ code: 400 });
  });

  it('Correctly updates the readme contents', async () => {
    await expect(setReadme('New readme'))
      .toResolve();
    // API shows it correctly
    await expect(getReadme())
      .resolves.toStrictEqual({ readme: 'New readme' });
    // Stored correctly on the disk
    await expect(getReadmeFromDisk()).resolves.toStrictEqual('New readme');
  });

  it('Sets up a default readme', async () => {
    await expect(getReadme())
      .resolves.toStrictEqual({ readme: expect.any(String) });
  });
}

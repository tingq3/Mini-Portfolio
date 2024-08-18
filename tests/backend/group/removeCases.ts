/** Shared test cases for deleting items/groups */

import api from '$endpoints';
import { beforeEach, expect, it, test } from 'vitest';

/**
 * Generate shared test cases for deleting items or groups.
 *
 * Similar design to `generateTestCases` from `creationCases.ts`, see that
 * documentation for usage.
 */
export default function generateTestCases<T>(
  setup: () => Promise<void>,
  create: (id: string) => Promise<void>,
  getInfo: (id: string) => Promise<any>,
  remove: (id: string) => Promise<Record<string, never>>,
) {
  beforeEach(async () => { await setup(); });

  test('Successful removal', async () => {
    await create('example');
    await expect(remove('example')).resolves.toStrictEqual({});
    // Group is removed
    await expect(getInfo('example')).rejects.toMatchObject({ code: 404 });
  });

  test('Can be recreated after deletion', async () => {
    await create('example');
    await remove('example');
    await expect(create('example')).toResolve();
  });

  it("Gives an error if subject doesn't exist", async () => {
    await expect(remove('invalid-group'))
      .rejects.toMatchObject({ code: 404 });
  });

  it("Gives an error if the server isn't initialized", async () => {
    await create('example');
    await api.debug.clear();
    await expect(remove('example'))
      .rejects.toMatchObject({ code: 400 });
  });
}

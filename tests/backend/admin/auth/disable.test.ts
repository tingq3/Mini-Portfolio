/**
 * Test cases for POST /api/admin/auth/disable
 */
import { it, expect } from 'vitest';
import { setup } from '../../helpers';

it('Disables authentication', async () => {
  const { api, credentials: { username, password } } = await setup();
  await expect(api.admin.auth.disable(password)).resolves.toStrictEqual({});
  // Logging in should fail
  await expect(api.admin.auth.login(username, password))
    .rejects.toMatchObject({ code: 403 });
  // And any operation using the token should also fail
  // Technically, this should be a 403, since no value can ever be successful,
  // but I don't want to add another code path
  await expect(api.admin.auth.logout()).rejects.toMatchObject({ code: 401 });
});

it('Errors for invalid tokens', async () => {
  const { api, credentials: { password } } = await setup();
  await expect(api.withToken('invalid').admin.auth.disable(password))
    .rejects.toMatchObject({ code: 401 });
});

it('Errors for incorrect passwords', async () => {
  const { api } = await setup();
  await expect(api.admin.auth.disable('incorrect'))
    .rejects.toMatchObject({ code: 403 });
});

it('Errors if the data is not set up', async () => {
  const { api, credentials: { password } } = await setup();
  await api.debug.clear();
  await expect(api.admin.auth.disable(password))
    .rejects.toMatchObject({ code: 400 });
});

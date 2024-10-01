import { hashAndSalt, validateTokenFromRequest } from '$lib/server/auth/tokens';
import { getPortfolioGlobals } from '$lib/server/data/index';
import { getLocalConfig, setLocalConfig } from '$lib/server/data/localConfig';
import { error, json } from '@sveltejs/kit';
import { nanoid } from 'nanoid';
import { object, string, validate } from 'superstruct';
import validator from 'validator';

const NewCredentials = object({
  newUsername: string(),
  oldPassword: string(),
  newPassword: string(),
});

export async function POST({ request, cookies }) {
  await getPortfolioGlobals().catch(e => error(400, e));
  await validateTokenFromRequest({ request, cookies });

  const local = await getLocalConfig();

  if (!local.auth) {
    throw Error('Unreachable');
  }

  const [err, newCredentials]
    = validate(await request.json(), NewCredentials);

  if (err) {
    return error(400, `${err}`);
  }

  const { newUsername, oldPassword, newPassword } = newCredentials;

  if (!newUsername) {
    return error(400, 'New username is empty');
  }

  if (hashAndSalt(local.auth.password.salt, oldPassword) !== local.auth.password.hash) {
    return error(403, 'Old password is incorrect');
  }

  if (!validator.isStrongPassword(newPassword)) {
    return error(400, 'New password is not strong enough');
  }

  // Hash and salt new password
  const salt = nanoid();
  const hash = hashAndSalt(salt, newPassword);
  local.auth.password = {
    hash,
    salt,
  };
  // Change the username
  local.auth.username = newUsername;
  await setLocalConfig(local);

  return json({}, { status: 200 });
}

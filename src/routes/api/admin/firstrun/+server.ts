import { error, json } from '@sveltejs/kit';
import { serverIsSetUp } from '$lib/server/data/dataDir';
import { authSetup } from '$lib/server/auth/setup';
import { object, optional, string, type Infer } from 'superstruct';
import { applyStruct } from '$lib/server/util';
import { validateId } from '$lib/validators';
import validator from 'validator';
import { setupData } from '$lib/server/data/setup.js';

const FirstRunOptionsStruct = object({
  username: string(),
  password: string(),
  repoUrl: optional(string()),
  branch: optional(string()),
});

export type FirstRunOptions = Infer<typeof FirstRunOptionsStruct>;

export async function POST({ request, cookies }) {
  const options = await applyStruct(await request.json(), FirstRunOptionsStruct);

  if (await serverIsSetUp()) {
    error(403);
  }

  // Validate username and password
  validateId('username', options.username);
  if (!validator.isStrongPassword(options.password)) {
    error(400, 'Password is not strong enough');
  }

  if (options.branch && !options.repoUrl) {
    error(400, 'Branch must not be given if repo URL is not provided');
  }

  const firstTime = await setupData(options.repoUrl, options.branch);

  // Now set up auth
  const credentials = await authSetup(options.username, options.password, cookies);

  return json({ credentials, firstTime }, { status: 200 });
}

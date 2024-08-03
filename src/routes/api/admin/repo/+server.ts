import { error, json } from '@sveltejs/kit';
import { dataDirIsInit, dataDirUsesGit, getDataDir } from '$lib/server/data/dataDir';
import { validateToken } from '$lib/server/auth.js';
import simpleGit from 'simple-git';

export async function GET({ request, cookies }) {
  const token = request.headers.get('Authorization');
  if (!token) {
    return error(401, 'Authorization token is required');
  }

  if (!await dataDirIsInit()) {
    return error(400, 'Server is not initialized');
  }

  try {
    await validateToken(token);
  } catch (e) {
    return error(401, `${e}`);
  }

  if (!await dataDirUsesGit()) {
    return json({ repo: null }, { status: 200 });
  }

  const repo = simpleGit(getDataDir());

  return json(
    {
      repo: {
        url: (await repo.remote(['get-url', 'origin']) || '').trim(),
        branch: (await repo.status()).current,
        commit: await repo.revparse(['--short', 'HEAD']),
      }
    },
    { status: 200 });
}

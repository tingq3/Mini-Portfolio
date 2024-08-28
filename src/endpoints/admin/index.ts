/** Admin endpoints */
import auth from './auth';
import config from './config';
import repo from './repo';
import firstrun from './firstrun';

export default function admin(token: string | undefined) {
  return {
    auth: auth(token),
    config: config(token),
    repo: repo(token),
    firstrun,
  };
}

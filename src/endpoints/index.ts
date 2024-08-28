/** API endpoints */
import admin from './admin';
import debug from './debug';
import group from './group';
import readme from './readme';

/** Create an instance of the API client with the given token */
export default function api(token?: string | undefined) {
  return {
    admin: admin(token),
    debug: debug(token),
    group: group(token),
    readme: readme(token),
    /** Create a new API client with the given token */
    withToken: (token: string | undefined) => api(token),
  };
}

/** API client type */
export type ApiClient = ReturnType<typeof api>;

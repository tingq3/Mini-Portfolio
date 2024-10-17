/**
 * Code for managing more complex aspects of requests.
 */

import type { RequestEvent } from '@sveltejs/kit';
import { authIsSetUp } from './data/dataDir';
import { getLocalConfig } from './data/localConfig';

/** Returns the IP address of the client that sent the request */
export async function getIpFromRequest(event: RequestEvent): Promise<string> {
  if (!await authIsSetUp()) {
    return event.getClientAddress();
  }
  const config = await getLocalConfig();
  const realIp = event.getClientAddress();
  if (config.allowCloudflareIp) {
    return event.request.headers.get('CF-Connecting-IP') ?? realIp;
  } else {
    return realIp;
  }
}

import { getLocalConfig, type ConfigLocalJson } from '$lib/server/data/localConfig';
import { error, type Handle } from '@sveltejs/kit';

const banMiddleware: Handle = async (req) => {
  let config: ConfigLocalJson;
  try {
    config = await getLocalConfig();
  } catch (e) {
    // Log error
    console.log(e);
    return req.resolve(req.event);
  }
  const ip = req.event.getClientAddress();
  if (config.bannedIps.includes(ip)) {
    error(403, 'This IP address is banned');
  }
  const userAgent = req.event.request.headers.get('User-Agent');
  if (!userAgent) {
    error(403, 'Please set a User-Agent header identifying your application.');
  }
  for (const regex of config.bannedUserAgents) {
    if (RegExp(regex).test(userAgent)) {
      error(403, 'Your User-Agent is banned');
    }
  }
  // They are fine, let them access the site
  return req.resolve(req.event);
}

export default banMiddleware;

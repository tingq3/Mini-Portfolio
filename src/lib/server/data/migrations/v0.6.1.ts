/**
 * Migration to v0.6.1
 */

import { setLocalConfig } from '../localConfig';
import { updateConfigVersions } from './shared';
import { unsafeLoadLocalConfig } from './unsafeLoad';


export default async function migrate(dataDir: string, privateDataDir: string) {
  const config = await unsafeLoadLocalConfig(privateDataDir) as any;
  config.allowCloudflareIp = false;
  await setLocalConfig(config);
  await updateConfigVersions();
}

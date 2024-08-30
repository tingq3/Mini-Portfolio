/**
 * Migration from 0.2.0 to 0.3.0.
 *
 * Adds missing `filterItems` property to groups.
 */

import { version } from '$app/environment';
import { updateConfigVersions } from '.';
import { listGroups, setGroupInfo, type GroupInfo } from '../group';
import { unsafeLoadGroupInfo } from './unsafeLoad';

export default async function migrate(dataDir: string) {
  console.log(`Migrate from v0.2.x -> ${version}`);

  await updateConfigVersions();

  // For each group
  for (const groupId of await listGroups()) {
    console.log(`  ${groupId}`);
    // Technically the `filterItems` property doesn't exist, but it's close
    // enough since we add it immediately
    const info = await unsafeLoadGroupInfo(dataDir, groupId) as GroupInfo;
    info.filterItems = [];
    await setGroupInfo(groupId, info);
  }
}

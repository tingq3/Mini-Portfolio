import { version } from '$app/environment';
import { getConfig, setConfig } from '../config';
import { getDataDir } from '../dataDir';
import { getLocalConfig, setLocalConfig } from '../localConfig';
import migrateFromV010 from './v0.1.0';

/** Update config versions */
async function updateConfigVersions() {
  const config = await getConfig();
  config.version = version;
  await setConfig(config);
  const configLocal = await getLocalConfig();
  configLocal.version = version;
  await setLocalConfig(configLocal);
}

/** Perform a migration from the given version */
export default async function migrate(oldVersion: string) {
  console.log(`Data directory uses version ${oldVersion}. Migration needed`);
  try {
    if (oldVersion === '0.1.0') {
      await migrateFromV010(getDataDir());
    } else if (oldVersion === '0.2.0') {
      // FIXME: Need a nicer system for these kinds of version differences
      // perhaps using semver?
      await updateConfigVersions();
    } else {
      const message = `Migrate: unrecognised old version ${oldVersion}`;
      console.log(message);
      throw new Error(message);
    }
  } catch (e) {
    console.log('!!! Error during migration');
    console.log(e);
    throw e;
  }
}

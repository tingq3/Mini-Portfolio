import { getDataDir } from '../dataDir';
import migrateFromV010 from './v0.1.0';

/** Perform a migration from the given version */
export default async function migrate(oldVersion: string) {
  console.log(`Data directory uses version ${oldVersion}. Migration needed`);
  try {
    if (oldVersion === '0.1.0') {
      await migrateFromV010(getDataDir());
    } else {
      console.log(`Migrate: unrecognised old version ${oldVersion}`);
      process.exit(1);
    }
  } catch (e) {
    console.log('!!! Error during migration');
    console.log(e);
    process.exit(1);
  }
}

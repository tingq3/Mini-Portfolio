import { version } from '$app/environment';
import type { ConfigJson } from './server/data/config';

const blankConfig: ConfigJson = {
  siteName: 'Minifolio',
  listedGroups: [],
  color: '#ffaaff',
  version,
};

export default blankConfig;

import { version } from '$app/environment';
import consts from './consts';
import type { ConfigJson } from './server/data/config';

const blankConfig: ConfigJson = {
  siteName: consts.APP_NAME,
  siteShortName: consts.APP_NAME,
  siteDescription: '',
  siteKeywords: [],
  listedGroups: [],
  color: '#ffaaff',
  version,
};

export default blankConfig;

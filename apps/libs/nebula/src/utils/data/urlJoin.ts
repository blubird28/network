import { trim } from 'lodash';

import { pathJoin } from './pathJoin';

export const urlJoin = (base: string, ...parts: string[]): string =>
  encodeURI(trim(base, '/') + pathJoin(...parts));

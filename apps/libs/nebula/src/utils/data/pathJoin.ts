import { trim } from 'lodash';

export const pathJoin = (...parts: string[]): string =>
  '/' +
  parts
    .map((p) => trim(p, '/'))
    .filter(Boolean)
    .join('/');

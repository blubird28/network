import { isNonEmptyString } from '../../utils/data/isNonEmptyString';

export const urlTemplate = (pattern: string, params: unknown): string =>
  Object.entries(params || {}).reduce(
    (acc, [key, val]) =>
      isNonEmptyString(key) && isNonEmptyString(val)
        ? acc.replace(`:${key}`, encodeURIComponent(val))
        : acc,
    pattern,
  );

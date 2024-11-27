import traverse from 'traverse';
import { escapeRegExp, isRegExp, isString, snakeCase, kebabCase } from 'lodash';

export interface SearchConfig {
  keySearch: string;
  snake?: boolean;
  kebab?: boolean;
  caseInsensitive?: boolean;
  full?: boolean;
}

export type RedactKeysParam = SearchConfig | string | RegExp;

export type DeepRedacted<T> = {
  [K in keyof T]: T[K] | string;
};

export type Redactor = <T = unknown>(toRedact: T) => DeepRedacted<T>;

export const REDACTED = '[redacted]';
export const DEFAULT_KEYS: RedactKeysParam[] = [
  'accessToken',
  { keySearch: 'password', full: false },
  { keySearch: 'apiKey', full: false },
  'authorization',
  'authorisation',
  'token',
  'shield-token',
  'portal-token',
  'salt',
  'secret',
  'hash',
];

export const searchConfigToRegex = ({
  keySearch,
  full = true,
  caseInsensitive = true,
  snake = true,
  kebab = true,
}: SearchConfig): RegExp => {
  const escapedSearches = [
    keySearch,
    snake && snakeCase(keySearch),
    kebab && kebabCase(keySearch),
  ]
    .filter(Boolean)
    .map(escapeRegExp);
  const groupedSearch = `(?:${escapedSearches.join('|')})`;
  return new RegExp(
    full ? `^${groupedSearch}$` : groupedSearch,
    caseInsensitive ? 'i' : '',
  );
};

export const keySearchToRegex = (keySearch: RedactKeysParam): RegExp => {
  if (isRegExp(keySearch)) {
    return keySearch;
  }
  if (isString(keySearch)) {
    return searchConfigToRegex({ keySearch });
  }
  return searchConfigToRegex(keySearch);
};

export const byKeys = (...keySearches: RedactKeysParam[]): Redactor => {
  const regexes = keySearches.map(keySearchToRegex);
  return (toRedact) =>
    traverse(toRedact).map(function () {
      if (this.notRoot && regexes.some((regex) => regex.test(this.key))) {
        this.update(REDACTED);
      }
    });
};

export default byKeys(...DEFAULT_KEYS);

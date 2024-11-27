import {
  isArray,
  isBoolean,
  isDate,
  isEmpty,
  isEqual,
  isFinite,
  isInteger,
  isNumber,
  isString,
  sortBy,
  uniq,
} from 'lodash';
import { isISO8601 } from 'class-validator';

import { isNonEmptyString } from '@libs/nebula/utils/data/isNonEmptyString';
import { SerializedData } from '@libs/nebula/Serialization/serializes';
import Errors from '@libs/nebula/Error';

import { StoredASN } from './asn.interfaces';

type PickByType<T, PropType> = {
  [P in keyof T as T[P] extends PropType | undefined | null ? P : never]: T[P];
};

export const isMoreRecent = (
  test: Date | null,
  compare: Date | null,
): boolean => {
  if (!test) {
    return false;
  }
  if (!compare) {
    return true;
  }
  return test > compare;
};

export const mostRecentOf = (...dates: (Date | null)[]): Date | null => {
  return dates.reduce(
    (prev, curr) => (isMoreRecent(curr, prev) ? curr : prev),
    null,
  );
};

export const mostRecentRecord = <T, K extends keyof PickByType<T, Date>>(
  records: T[],
  key: K,
): T | null => {
  return records.reduce(
    (prev, curr) =>
      isMoreRecent(curr?.[key] as Date | null, prev?.[key] as Date | null)
        ? curr
        : prev,
    null,
  );
};

export const arePrefixListsEqual = (listA: string[], listB: string[]) => {
  if (isEmpty(listA) && isEmpty(listB)) {
    return true;
  }

  if (isEmpty(listA) || isEmpty(listB)) {
    return false;
  }

  return isEqual(sortBy(listA), sortBy(listB));
};
export const asDate = (date: SerializedData): Date | null => {
  if (isDate(date)) {
    return date;
  }
  if (
    isString(date) &&
    isISO8601(date, { strict: true, strictSeparator: true })
  ) {
    return new Date(date);
  }
  return null;
};

export const asNonEmptyString = (val: SerializedData): string | null => {
  if (isNonEmptyString(val)) {
    return val;
  }
  return null;
};

export const asPrefixList = (val: SerializedData): string[] | null => {
  if (isArray(val) && val.every(isString)) {
    return val as string[];
  }
  return null;
};
export const asBoolean = (val: SerializedData): boolean =>
  isBoolean(val) ? val : false;

export const mergeASNs = (
  storedASNs: Array<StoredASN | null>,
): StoredASN | null => {
  const nonNullASNs = storedASNs.filter(Boolean);

  if (isEmpty(nonNullASNs)) {
    return null;
  }
  if (nonNullASNs.length === 1) {
    return nonNullASNs[0];
  }

  const asns = uniq(nonNullASNs.map(({ asn }) => asn).filter(Boolean));
  if (asns.length > 1) {
    throw new Errors.UnmatchedASN({
      asns,
    });
  }
  const asn = asns[0];
  const asSets = uniq(
    nonNullASNs.map(({ asSet }) => asNonEmptyString(asSet)).filter(Boolean),
  );
  if (asSets.length > 1) {
    throw new Errors.UnmatchedASSet({
      asn,
      asSets: asSets.join(', '),
    });
  }

  const mostRecentlyUpdated = mostRecentRecord(
    nonNullASNs,
    'ipPrefixLastSLUpdateSuccessAt',
  );
  const mostRecentlyErrored = mostRecentRecord(
    nonNullASNs,
    'ipPrefixLastErrorAt',
  );
  const mostRecentlyChecked = mostRecentRecord(
    nonNullASNs,
    'ipPrefixLastCheckedAt',
  );

  return {
    asn,
    resourceIds: uniq(
      nonNullASNs.flatMap(({ resourceIds }) => resourceIds).filter(Boolean),
    ),
    consoleIds: uniq(
      nonNullASNs.flatMap(({ consoleIds }) => consoleIds).filter(Boolean),
    ),
    asSet: asSets[0] ?? undefined,
    deallocatedAt: mostRecentOf(
      ...nonNullASNs.map(({ deallocatedAt }) => deallocatedAt),
    ),
    ipPrefixConfiguredInIPCV4: mostRecentlyChecked?.ipPrefixConfiguredInIPCV4,
    ipPrefixConfiguredInIPCV6: mostRecentlyChecked?.ipPrefixConfiguredInIPCV6,
    ipPrefixConfiguredInSLV4: mostRecentlyUpdated?.ipPrefixConfiguredInSLV4,
    ipPrefixConfiguredInSLV6: mostRecentlyUpdated?.ipPrefixConfiguredInSLV6,
    ipPrefixLastCheckedAt: mostRecentlyChecked?.ipPrefixLastCheckedAt,
    ipPrefixLastErrorAt: mostRecentlyErrored?.ipPrefixLastErrorAt,
    ipPrefixLastErrorReason: mostRecentlyErrored?.ipPrefixLastErrorReason,
    ipPrefixLastSLUpdateRequestAt: mostRecentOf(
      ...nonNullASNs.map(
        ({ ipPrefixLastSLUpdateRequestAt }) => ipPrefixLastSLUpdateRequestAt,
      ),
    ),
    ipPrefixLastSLUpdateSuccessAt:
      mostRecentlyUpdated?.ipPrefixLastSLUpdateSuccessAt,
    private: nonNullASNs.some((asn) => asn.private),
    skipPrefixSync: nonNullASNs.some(({ skipPrefixSync }) => skipPrefixSync),
    status: nonNullASNs.every(({ status }) => status === 'VERIFIED')
      ? 'VERIFIED'
      : 'UNVERIFIED',
  };
};

const ASN_REGEX = /^as(\d+)$/i;

export const getNumericASN = (asn: number | string): number => {
  if (isNumber(asn)) {
    if (!isFinite(asn) || !isInteger(asn) || asn <= 0) {
      throw new Errors.InvalidASNFormat({ asn });
    }
    return asn;
  }
  if (!isString(asn) || isEmpty(asn)) {
    throw new Errors.InvalidASNFormat({ asn });
  }
  const asnMatches = asn.match(ASN_REGEX);
  if (asnMatches) {
    return getNumericASN(parseInt(asnMatches[1], 10));
  }
  return getNumericASN(parseInt(asn, 10));
};

// Takes an ASN as a number, a numeric string, or a string prefixed with AS (eg 'AS3491')
// Returns a string prefixed with AS (eg 'AS3491')
// Throws Errors.InvalidASNFormat for other inputs, or if the numeric portion is not a positive, finite integer
export const normalizeAsn = (asn: number | string): string => {
  return `AS${getNumericASN(asn)}`;
};

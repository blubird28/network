import {
  FAKE_ASN,
  FAKE_IP_V4_PREFIX,
  FAKE_IP_V6_PREFIX,
  FIRST_JAN_2020,
  FIRST_JAN_2020_STRING,
  FIRST_JUN_2020,
  FIRST_MAR_2020,
} from '@libs/nebula/testing/data/constants';
import Errors from '@libs/nebula/Error';

import {
  asBoolean,
  asDate,
  asNonEmptyString,
  asPrefixList,
  isMoreRecent,
  mergeASNs,
  mostRecentOf,
  mostRecentRecord,
  normalizeAsn,
} from './utils';
import { FAKE_STORED_ASN } from './test-data';
import { StoredASN } from './asn.interfaces';

describe('asn utilities', () => {
  it.each([
    [false, 'first', 'falsey', null, FIRST_MAR_2020],
    [true, 'second', 'falsey', FIRST_MAR_2020, null],
    [true, 'first', 'more recent', FIRST_MAR_2020, FIRST_JAN_2020],
    [false, 'second', 'more recent', FIRST_MAR_2020, FIRST_JUN_2020],
  ])('isMoreRecent returns %s if the %s param is %', (...inputs) => {
    expect.hasAssertions();

    const [expected, , , ...params] = inputs;

    expect(isMoreRecent(...params)).toBe(expected);
  });

  it('mostRecentOf returns the most recent date it is passed', () => {
    expect.hasAssertions();

    expect(
      mostRecentOf(FIRST_MAR_2020, FIRST_JAN_2020, FIRST_JUN_2020),
    ).toStrictEqual(FIRST_JUN_2020);
  });

  it('mostRecentRecord returns the record with the most recent date in a given prop', () => {
    expect.hasAssertions();

    const records = [FIRST_MAR_2020, FIRST_JAN_2020, FIRST_JUN_2020].map(
      (date, i) => ({ date, i }),
    );
    expect(mostRecentRecord(records, 'date')).toStrictEqual(records[2]);
  });

  it('asDate converts strings to dates', () => {
    expect.hasAssertions();

    expect(asDate(FIRST_JAN_2020_STRING)).toStrictEqual(FIRST_JAN_2020);
  });

  it('asDate returns dates unchanged', () => {
    expect.hasAssertions();

    expect(asDate(FIRST_JAN_2020)).toBe(FIRST_JAN_2020);
  });

  it('asDate returns null for anything else', () => {
    expect.hasAssertions();

    expect(asDate('tuesday')).toBeNull();
    expect(asDate(undefined)).toBeNull();
    expect(asDate(null)).toBeNull();
    expect(asDate(true)).toBeNull();
    expect(asDate([])).toBeNull();
    expect(asDate({})).toBeNull();
  });

  it('asNonEmptyString returns non-empty strings unchanged', () => {
    expect.hasAssertions();

    expect(asNonEmptyString('foo')).toBe('foo');
  });

  it('asNonEmptyString returns null for anything else', () => {
    expect.hasAssertions();

    expect(asNonEmptyString(FIRST_JUN_2020)).toBeNull();
    expect(asNonEmptyString(undefined)).toBeNull();
    expect(asNonEmptyString(null)).toBeNull();
    expect(asNonEmptyString(true)).toBeNull();
    expect(asNonEmptyString([])).toBeNull();
    expect(asNonEmptyString({})).toBeNull();
  });

  it('asPrefixList returns string arrays unchanged', () => {
    expect.hasAssertions();

    const arr = ['foo', 'bar', 'baz'];
    expect(asPrefixList(arr)).toBe(arr);
  });

  it('asPrefixList returns null for anything else', () => {
    expect.hasAssertions();

    expect(asNonEmptyString(FIRST_JUN_2020)).toBeNull();
    expect(asNonEmptyString(undefined)).toBeNull();
    expect(asNonEmptyString(null)).toBeNull();
    expect(asNonEmptyString(true)).toBeNull();
    expect(asNonEmptyString({})).toBeNull();
    expect(asNonEmptyString(['foo', 'bar', 2])).toBeNull();
  });

  it('asBoolean returns booleans unchanged', () => {
    expect.hasAssertions();

    expect(asBoolean(true)).toBe(true);
    expect(asBoolean(false)).toBe(false);
  });

  it('asBoolean returns null for anything else', () => {
    expect.hasAssertions();

    expect(asNonEmptyString(FIRST_JUN_2020)).toBeNull();
    expect(asNonEmptyString(undefined)).toBeNull();
    expect(asNonEmptyString(null)).toBeNull();
    expect(asNonEmptyString({})).toBeNull();
    expect(asNonEmptyString([])).toBeNull();
  });

  describe('mergeASNs', () => {
    const storedAsn: StoredASN = { ...FAKE_STORED_ASN };
    it('considers the record verified only if all records are verified', () => {
      expect.hasAssertions();
      const unverifiedStoredAsn: StoredASN = {
        ...storedAsn,
        status: 'UNVERIFIED',
      };

      expect(mergeASNs([storedAsn, unverifiedStoredAsn])).toStrictEqual(
        unverifiedStoredAsn,
      );
    });
    it('considers the record to skip prefix sync if any record is set to skip', () => {
      expect.hasAssertions();
      const skippedStoredAsn: StoredASN = {
        ...storedAsn,
        skipPrefixSync: true,
      };

      expect(mergeASNs([storedAsn, skippedStoredAsn])).toStrictEqual(
        skippedStoredAsn,
      );
    });
    it('considers the record private if any record is private', () => {
      expect.hasAssertions();
      const privateStoredAsn: StoredASN = {
        ...storedAsn,
        private: true,
      };

      expect(mergeASNs([storedAsn, privateStoredAsn])).toStrictEqual(
        privateStoredAsn,
      );
    });
    it('gets the error reason from the most recently errored record', () => {
      expect.hasAssertions();
      const errorStoredAsn: StoredASN = {
        ...storedAsn,
        ipPrefixLastErrorReason: 'it broke',
        ipPrefixLastErrorAt: FIRST_JUN_2020,
      };

      expect(mergeASNs([storedAsn, errorStoredAsn])).toStrictEqual(
        errorStoredAsn,
      );
    });
    it('gets the deallocation date from the most recently deallocated record', () => {
      expect.hasAssertions();
      const deallocatedStoredAsn: StoredASN = {
        ...storedAsn,
        deallocatedAt: FIRST_JUN_2020,
      };

      expect(mergeASNs([storedAsn, deallocatedStoredAsn])).toStrictEqual(
        deallocatedStoredAsn,
      );
    });
    it('gets the IPC prefixes from the most recently checked record', () => {
      expect.hasAssertions();
      const recentlyCheckedStoredAsn: StoredASN = {
        ...storedAsn,
        ipPrefixLastCheckedAt: FIRST_JUN_2020,
        ipPrefixConfiguredInIPCV4: [FAKE_IP_V4_PREFIX, FAKE_IP_V4_PREFIX],
        ipPrefixConfiguredInIPCV6: [FAKE_IP_V6_PREFIX, FAKE_IP_V6_PREFIX],
      };

      expect(mergeASNs([storedAsn, recentlyCheckedStoredAsn])).toStrictEqual(
        recentlyCheckedStoredAsn,
      );
    });
    it('gets the SL prefixes from the most recently updated record', () => {
      expect.hasAssertions();
      const recentlyUpdatedStoredAsn: StoredASN = {
        ...storedAsn,
        ipPrefixLastSLUpdateSuccessAt: FIRST_JUN_2020,
        ipPrefixConfiguredInSLV4: [FAKE_IP_V4_PREFIX, FAKE_IP_V4_PREFIX],
        ipPrefixConfiguredInSLV6: [FAKE_IP_V6_PREFIX, FAKE_IP_V6_PREFIX],
      };

      expect(mergeASNs([storedAsn, recentlyUpdatedStoredAsn])).toStrictEqual(
        recentlyUpdatedStoredAsn,
      );
    });
    it('gets the most recent SL update attempt', () => {
      expect.hasAssertions();
      const juneStoredAsn: StoredASN = {
        ...storedAsn,
        ipPrefixLastSLUpdateRequestAt: FIRST_JUN_2020,
      };
      const janStoredAsn: StoredASN = {
        ...storedAsn,
        ipPrefixLastSLUpdateRequestAt: FIRST_JAN_2020,
      };

      expect(mergeASNs([storedAsn, juneStoredAsn, janStoredAsn])).toStrictEqual(
        juneStoredAsn,
      );
    });
    it('returns unchanged for a single record', () => {
      expect.hasAssertions();

      expect(mergeASNs([storedAsn])).toBe(storedAsn);
    });
    it('returns null for an empty list', () => {
      expect.hasAssertions();

      expect(mergeASNs([])).toBeNull();
    });
    it('throws if it encounters unmatched ASNs', () => {
      expect.hasAssertions();
      const differentStoredAsn: StoredASN = {
        ...storedAsn,
        asn: 42,
      };

      expect(() => mergeASNs([storedAsn, differentStoredAsn])).toThrow(
        Errors.UnmatchedASN,
      );
    });
    it('throws if it encounters unmatched AS-Sets', () => {
      expect.hasAssertions();
      const differentStoredAsn: StoredASN = {
        ...storedAsn,
        asSet: 'AS-IF',
      };

      expect(() => mergeASNs([storedAsn, differentStoredAsn])).toThrow(
        Errors.UnmatchedASSet,
      );
    });
  });

  describe('normalizeASN', () => {
    const expectedAsn = `AS${FAKE_ASN}`;
    it('throws for values other than string or number', () => {
      expect.hasAssertions();
      expect(() => normalizeAsn(false as unknown as string)).toThrow(
        Errors.InvalidASNFormat,
      );
      expect(() => normalizeAsn([] as unknown as string)).toThrow(
        Errors.InvalidASNFormat,
      );
      expect(() => normalizeAsn({} as unknown as string)).toThrow(
        Errors.InvalidASNFormat,
      );
    });
    it('throws for negative numbers', () => {
      expect.hasAssertions();
      expect(() => normalizeAsn(-10)).toThrow(Errors.InvalidASNFormat);
    });
    it('throws for non-finite numbers', () => {
      expect.hasAssertions();
      expect(() => normalizeAsn(Number.POSITIVE_INFINITY)).toThrow(
        Errors.InvalidASNFormat,
      );
    });
    it('throws for non-integer numbers', () => {
      expect.hasAssertions();
      expect(() => normalizeAsn(10.56)).toThrow(Errors.InvalidASNFormat);
    });
    it('throws for non-numeric strings', () => {
      expect.hasAssertions();
      expect(() => normalizeAsn('seven')).toThrow(Errors.InvalidASNFormat);
    });
    it('prefixes AS to valid numbers', () => {
      expect.hasAssertions();
      expect(normalizeAsn(FAKE_ASN)).toBe(expectedAsn);
    });
    it('prefixes AS to valid numeric strings', () => {
      expect.hasAssertions();
      expect(normalizeAsn(String(FAKE_ASN))).toBe(expectedAsn);
    });
    it('converts strings matching the pattern to uppercase', () => {
      expect.hasAssertions();
      expect(normalizeAsn(`as${FAKE_ASN}`)).toBe(expectedAsn);
    });
    it('accepts valid strings without change', () => {
      expect.hasAssertions();
      expect(normalizeAsn(expectedAsn)).toBe(expectedAsn);
    });
  });
});

import { isNull } from 'lodash';

import {
  fieldsMatch,
  And,
  FieldsEqual,
  Left,
  Not,
  Or,
  Right,
  matchingKeys,
  failingKeys,
} from '@libs/nebula/utils/data/fieldsMatch';

describe('fieldsMatch', () => {
  const testObj = { foo: 0, bar: 1, baz: 2 };
  const fields: Array<keyof typeof testObj> = ['foo', 'bar', 'baz'];
  it('returns true if fields match', () => {
    expect(fieldsMatch({ ...testObj }, { ...testObj }, fields)).toBe(true);
  });
  it('returns true if fields match - even if other fields are present', () => {
    expect(
      fieldsMatch(
        { ...testObj, extra: 'a' },
        { ...testObj, extra: 'b' },
        fields,
      ),
    ).toBe(true);
  });
  it('returns false if any fields do not match', () => {
    expect(fieldsMatch({ ...testObj }, { ...testObj, foo: 'b' }, fields)).toBe(
      false,
    );
  });
  it('compares strictly', () => {
    expect(
      fieldsMatch({ ...testObj }, { ...testObj, foo: false }, fields),
    ).toBe(false);
    expect(fieldsMatch({ ...testObj }, { ...testObj, foo: '0' }, fields)).toBe(
      false,
    );
    expect(
      fieldsMatch(
        { ...testObj, foo: null },
        { ...testObj, foo: 'undefined' },
        fields,
      ),
    ).toBe(false);
  });
  it('returns false if no keys are passed', () => {
    expect(fieldsMatch({ ...testObj }, { ...testObj }, [])).toBe(false);
  });
  it('returns false if either value is falsey', () => {
    expect(fieldsMatch(null, { ...testObj }, fields)).toBe(false);
    expect(fieldsMatch({ ...testObj }, null, fields)).toBe(false);
    expect(fieldsMatch(null, null, fields)).toBe(false);
    expect(fieldsMatch(undefined, { ...testObj }, fields)).toBe(false);
    expect(fieldsMatch({ ...testObj }, undefined, fields)).toBe(false);
    expect(fieldsMatch(undefined, undefined, fields)).toBe(false);
  });

  it('handles complex matchers', () => {
    const isZero = (n) => n === 0;
    const rightNullOrFieldsEqualAndNonZero = Or(
      And(FieldsEqual, Not(Left(isZero))),
      Right(isNull),
    );

    expect(
      fieldsMatch(
        { ...testObj },
        { ...testObj, foo: null },
        fields,
        rightNullOrFieldsEqualAndNonZero,
      ),
    ).toBe(true);
    expect(
      fieldsMatch(
        { ...testObj },
        { foo: null, bar: null, baz: null },
        fields,
        rightNullOrFieldsEqualAndNonZero,
      ),
    ).toBe(true);

    expect(
      fieldsMatch(
        { ...testObj },
        { ...testObj },
        fields,
        rightNullOrFieldsEqualAndNonZero,
      ),
    ).toBe(false);
    expect(
      fieldsMatch(
        { ...testObj },
        { ...testObj, foo: 3 },
        fields,
        rightNullOrFieldsEqualAndNonZero,
      ),
    ).toBe(false);
    expect(
      fieldsMatch(
        { ...testObj, foo: 3 },
        { ...testObj },
        fields,
        rightNullOrFieldsEqualAndNonZero,
      ),
    ).toBe(false);
    expect(
      fieldsMatch(
        { ...testObj, foo: null },
        { ...testObj },
        fields,
        rightNullOrFieldsEqualAndNonZero,
      ),
    ).toBe(false);
  });

  it('can show the keys which match or do not', () => {
    expect.hasAssertions();

    expect(
      matchingKeys({ ...testObj }, { ...testObj, bar: null }, fields),
    ).toStrictEqual(['foo', 'baz']);
    expect(
      failingKeys({ ...testObj }, { ...testObj, bar: null }, fields),
    ).toStrictEqual(['bar']);
  });

  it('for invalid input, no keys are considered matching', () => {
    expect.hasAssertions();

    expect(matchingKeys({ ...testObj }, null, fields)).toStrictEqual([]);
    expect(matchingKeys(null, { ...testObj }, fields)).toStrictEqual([]);
    expect(matchingKeys(null, null, fields)).toStrictEqual([]);
    expect(matchingKeys({ ...testObj }, { ...testObj }, [])).toStrictEqual([]);
  });

  it('for invalid input, all keys are considered failing', () => {
    expect.hasAssertions();

    expect(failingKeys({ ...testObj }, null, fields)).toStrictEqual(fields);
    expect(failingKeys(null, { ...testObj }, fields)).toStrictEqual(fields);
    expect(failingKeys(null, null, fields)).toStrictEqual(fields);
    expect(failingKeys({ ...testObj }, { ...testObj }, [])).toStrictEqual([]);
  });
});

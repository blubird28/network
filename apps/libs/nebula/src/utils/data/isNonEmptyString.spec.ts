import { isNonEmptyString } from '@libs/nebula/utils/data/isNonEmptyString';

describe('isNonEmptyString', () => {
  it('returns false for empty string', () => {
    expect.hasAssertions();
    expect(isNonEmptyString('')).toBe(false);
  });
  it('returns false for non string', () => {
    expect.hasAssertions();
    expect(isNonEmptyString({ foo: 'bar' })).toBe(false);
  });
  it('returns false for undefined', () => {
    expect.hasAssertions();
    expect(isNonEmptyString(undefined)).toBe(false);
  });
  it('returns false for null', () => {
    expect.hasAssertions();
    expect(isNonEmptyString(null)).toBe(false);
  });
  it('returns true for non empty string', () => {
    expect.hasAssertions();
    expect(isNonEmptyString('foo')).toBe(true);
  });
});

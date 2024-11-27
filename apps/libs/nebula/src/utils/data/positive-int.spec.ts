import positiveInt from '@libs/nebula/utils/data/positive-int';

describe('positive int helper', () => {
  it('given a positive integer, returns that int', () => {
    expect(positiveInt(1)).toBe(1);
  });
  it('given a string representation of a positive integer, returns that int', () => {
    expect(positiveInt('1')).toBe(1);
  });
  it('given a positive non-integer or string representation of one, returns the closest positive int less than it', () => {
    expect(positiveInt(1.5)).toBe(1);
    expect(positiveInt('1.5')).toBe(1);
  });
  it('given anything else, returns null', () => {
    expect(positiveInt(-1)).toBeNull();
    expect(positiveInt(-1.5)).toBeNull();
    expect(positiveInt('-1')).toBeNull();
    expect(positiveInt('-1.5')).toBeNull();
    expect(positiveInt('other string')).toBeNull();
    expect(positiveInt(null)).toBeNull();
    expect(positiveInt(true)).toBeNull();
    expect(positiveInt(Number.NaN)).toBeNull();
    expect(positiveInt({})).toBeNull();
    expect(positiveInt([])).toBeNull();
  });
});

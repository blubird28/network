import splitAndTrim from './splitAndTrim';

describe('splitAndTrim', () => {
  it('returns an array with one element given an empty string', () => {
    expect.hasAssertions();
    expect(splitAndTrim('', ',')).toStrictEqual(['']);
  });
  it('returns an array with one element given a string with only spaces', () => {
    expect.hasAssertions();
    expect(splitAndTrim('     ', ',')).toStrictEqual(['']);
  });
  it('trims each element', () => {
    expect.hasAssertions();
    expect(splitAndTrim('  a  , b  , c,   d', ',')).toStrictEqual([
      'a',
      'b',
      'c',
      'd',
    ]);
  });
  it('includes empty elements', () => {
    expect.hasAssertions();
    expect(splitAndTrim('  a  ,, b  ,   , c,   d,', ',')).toStrictEqual([
      'a',
      '',
      'b',
      '',
      'c',
      'd',
      '',
    ]);
  });
});

import zeroOrMore from './zeroOrMore';

describe('zeroOrMore', () => {
  it('given [] returns same reference', () => {
    const input = [];
    expect(zeroOrMore(input)).toBe(input);
  });

  it('given undefined returns []', () => {
    expect(zeroOrMore(undefined)).toStrictEqual([]);
  });

  it('given null returns []', () => {
    expect(zeroOrMore(null)).toStrictEqual([]);
  });

  it('given val returns [val]', () => {
    expect(zeroOrMore(1)).toStrictEqual([1]);
  });

  it('given falsey val returns [val]', () => {
    expect(zeroOrMore(0)).toStrictEqual([0]);
    expect(zeroOrMore(false)).toStrictEqual([false]);
    expect(zeroOrMore('')).toStrictEqual(['']);
  });

  it('given [val] returns same reference', () => {
    const input = [1];
    expect(zeroOrMore(input)).toBe(input);
  });
});

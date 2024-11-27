import noneOrMore from './noneOrMore';

describe('noneOrMore', () => {
  it('given [] returns same reference', () => {
    const input = [];
    expect(noneOrMore(input)).toBe(input);
  });

  it('given undefined returns undefined', () => {
    expect(noneOrMore(undefined)).toStrictEqual(undefined);
  });

  it('given null returns undefined', () => {
    expect(noneOrMore(null)).toStrictEqual(undefined);
  });

  it('given val returns [val]', () => {
    expect(noneOrMore(1)).toStrictEqual([1]);
  });

  it('given falsey val returns [val]', () => {
    expect(noneOrMore(0)).toStrictEqual([0]);
    expect(noneOrMore(false)).toStrictEqual([false]);
    expect(noneOrMore('')).toStrictEqual(['']);
  });

  it('given [val] returns same reference', () => {
    const input = [1];
    expect(noneOrMore(input)).toBe(input);
  });
});

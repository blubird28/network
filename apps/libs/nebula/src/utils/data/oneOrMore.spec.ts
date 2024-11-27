import oneOrMore from './oneOrMore';

describe('oneOrMore', () => {
  it('given [] returns []', () => {
    expect(oneOrMore([])).toStrictEqual([]);
  });

  it('given undefined returns [undefined]', () => {
    expect(oneOrMore(undefined)).toStrictEqual([undefined]);
  });

  it('given null returns [null]', () => {
    expect(oneOrMore(null)).toStrictEqual([null]);
  });

  it('given val returns [val]', () => {
    expect(oneOrMore(1)).toStrictEqual([1]);
  });

  it('given falsey val returns [val]', () => {
    expect(oneOrMore(0)).toStrictEqual([0]);
    expect(oneOrMore(false)).toStrictEqual([false]);
    expect(oneOrMore('')).toStrictEqual(['']);
  });

  it('given [val] returns [val]', () => {
    expect(oneOrMore([1])).toStrictEqual([1]);
  });
});

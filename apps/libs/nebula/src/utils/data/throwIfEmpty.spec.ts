import throwIfEmpty from './throwIfEmpty';

describe('throwIfEmpty', () => {
  it('returns what is passed generally', () => {
    const obj = { prop: 'object' };
    const str = 'string';
    const arr = ['a', 'r', 'r', 'a', 'y'];
    const num = 4;
    const bool = false;
    expect(throwIfEmpty(obj)).toBe(obj);
    expect(throwIfEmpty(str)).toBe(str);
    expect(throwIfEmpty(arr)).toBe(arr);
    expect(throwIfEmpty(num)).toBe(num);
    expect(throwIfEmpty(bool)).toBe(bool);
  });

  it('throws on null or undefined', () => {
    expect(() => throwIfEmpty(undefined)).toThrow(
      'Query parameter unexpectedly empty',
    );
    expect(() => throwIfEmpty(null)).toThrow(
      'Query parameter unexpectedly empty',
    );
  });
});

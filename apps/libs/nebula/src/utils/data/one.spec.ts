import one from './one';

describe('one', () => {
  it('given [] returns undefined', () => {
    expect(one([])).toBeUndefined();
  });

  it('given undefined returns undefined', () => {
    expect(one(undefined)).toBeUndefined();
  });

  it('given null returns null', () => {
    expect(one(null)).toBeNull();
  });

  it('given [undefined] returns undefined', () => {
    expect(one([undefined])).toBeUndefined();
  });

  it('given [null] returns null', () => {
    expect(one([null])).toBeNull();
  });

  it('given val returns val', () => {
    expect(one(1)).toStrictEqual(1);
  });

  it('given falsey val returns val', () => {
    expect(one([0])).toStrictEqual(0);
    expect(one([false])).toStrictEqual(false);
    expect(one([''])).toStrictEqual('');
  });

  it('given falsey [val] returns val', () => {
    expect(one(0)).toStrictEqual(0);
    expect(one(false)).toStrictEqual(false);
    expect(one('')).toStrictEqual('');
  });

  it('given [val] returns val', () => {
    expect(one([1])).toStrictEqual(1);
  });
});

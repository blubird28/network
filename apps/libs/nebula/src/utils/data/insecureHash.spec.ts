import * as crypto from 'crypto';

import { sortObjectKeys, createInsecureHash } from './insecureHash';

describe('sortObjectKeys function', () => {
  it('should sort object keys alphabetically', () => {
    const obj = { c: 3, a: 1, b: 2 };
    const sortedObj = sortObjectKeys(obj);
    expect(sortedObj).toEqual({ a: 1, b: 2, c: 3 });
  });

  it('should return an empty object if input object is empty', () => {
    const obj = {};
    const sortedObj = sortObjectKeys(obj);
    expect(sortedObj).toEqual({});
  });
});

describe('createInsecureHash function', () => {
  it('should return a consistent MD5 hash for a given object', () => {
    const obj1 = { a: 1, b: 2, c: 3 };
    const obj2 = { c: 3, b: 2, a: 1 };
    expect(createInsecureHash(obj1)).toEqual(createInsecureHash(obj2));
  });

  it('should return a different MD5 hash for different objects', () => {
    const obj1 = { a: 1, b: 2, c: 3 };
    const obj2 = { a: 1, b: 2, d: 4 };
    expect(createInsecureHash(obj1)).not.toEqual(createInsecureHash(obj2));
  });

  it('should return the same MD5 hash for an empty object', () => {
    const obj = {};
    const expectedHash = crypto.createHash('md5').update('{}').digest('hex');
    expect(createInsecureHash(obj)).toEqual(expectedHash);
  });
});

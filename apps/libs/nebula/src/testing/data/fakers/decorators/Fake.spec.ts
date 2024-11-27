import storage from '../storage';

import { Fake } from './Fake';

describe('Fake decorator', () => {
  it('Adds the appropriate data to metadata storage singleton', () => {
    class Foo {
      @Fake(1)
      prop: number;
    }

    const meta = storage.getMetadataByTarget(Foo).properties.get('prop');
    expect(meta).toStrictEqual(expect.any(Function));
    expect(meta()).toBe(1);
    expect(meta(2)).toBe(2);
  });
});

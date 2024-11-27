import { Expose } from 'class-transformer';

import { Faker, IntersectionFaker } from '..';
import storage from '../storage';

import { Fake } from './Fake';

describe('IntersectionFaker decorator', () => {
  @Faker({ transform: { exposeDefaultValues: true } })
  class Foo {
    @Fake(10)
    @Expose()
    foo: number;
  }

  @Faker({ transform: { exposeUnsetFields: true } })
  class Bar {
    @Fake(100)
    @Expose()
    bar: number;
  }
  @IntersectionFaker(Foo, Bar)
  class FooBar {}

  it('Adds the appropriate data to metadata storage singleton', () => {
    const meta = storage.getMetadataByTarget(FooBar);

    expect(meta.options.transform).toEqual({
      exposeDefaultValues: true,
      exposeUnsetFields: true,
    });
    const foo = meta.properties.get('foo');
    const bar = meta.properties.get('bar');

    expect(foo).toStrictEqual(expect.any(Function));
    expect(bar).toStrictEqual(expect.any(Function));

    expect(foo()).toStrictEqual(10);
    expect(bar()).toStrictEqual(100);

    expect(foo(50)).toStrictEqual(50);
    expect(bar(50)).toStrictEqual(50);
  });
});

import {
  ReferenceBuilder,
  ReferenceBuilderServiceBase,
} from './reference-builder.service';
import storage from './storage';

describe('Reference Builder Storage', () => {
  const refBuilder: ReferenceBuilder<any> = jest
    .fn()
    .mockReturnValue('Very unique reference');
  class Foo {
    foo: number;
  }
  class Bar extends Foo {
    bar: string;
  }
  class Baz {
    baz: string;
  }
  storage.set(Foo, refBuilder, 'FooWrapper');

  it('can get the stored builder for a type', () => {
    const result = storage.get(Foo);

    expect(result).not.toBeUndefined();
    expect(new result()).toBeInstanceOf(ReferenceBuilderServiceBase);
  });

  it('can get the stored builder for an ancestor type', () => {
    const result = storage.get(Bar);

    expect(result).not.toBeUndefined();
    expect(result).toBe(storage.get(Foo));
    expect(new result()).toBeInstanceOf(ReferenceBuilderServiceBase);
  });

  it('returns null for types not stored', () => {
    expect(storage.get(Baz)).toBeUndefined();
  });
});

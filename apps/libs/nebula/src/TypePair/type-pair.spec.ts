import { Type } from '@nestjs/common';

import { TypePair } from './type-pair';

describe('TypePair', () => {
  class Foo {}
  class Bar {}
  class Baz {}
  const testTypes = (first: Type, second: Type, pair: TypePair) => {
    expect(pair.types[0]).toBe(first);
    expect(pair.types[1]).toBe(second);
  };

  it('returns a different object for different params', () => {
    const FooBar = TypePair.get(Foo, Bar);
    const FooBaz = TypePair.get(Foo, Baz);
    expect(FooBar).not.toBe(FooBaz);
    testTypes(Foo, Bar, FooBar);
    testTypes(Foo, Baz, FooBaz);
  });

  it('returns a different object for different param order', () => {
    const FooBar = TypePair.get(Foo, Bar);
    const BarFoo = TypePair.get(Bar, Foo);
    expect(FooBar).not.toBe(BarFoo);
    testTypes(Foo, Bar, FooBar);
    testTypes(Bar, Foo, BarFoo);
  });

  it('returns the same object for the same params', () => {
    const FooBar = TypePair.get(Foo, Bar);
    const FooBarAgain = TypePair.get(Foo, Bar);
    expect(FooBar).toBe(FooBarAgain);
    testTypes(Foo, Bar, FooBar);
    testTypes(Foo, Bar, FooBarAgain);
  });
});

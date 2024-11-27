import {
  ReferenceBuilder,
  ReferenceBuilderServiceBase,
} from './reference-builder.service';

describe('ReferenceBuilderService', () => {
  class Foo {
    foo = 12;
  }
  const refBuilder: ReferenceBuilder<Foo> = ({ foo }) => `${foo}`;
  const builderMock = jest.fn(refBuilder);
  const refMock = jest.fn();
  const foo = new Foo();
  const otherFoo = new Foo();
  beforeEach(() => {
    builderMock.mockClear();
  });

  it('creates a reference builder service given a build function', () => {
    const service = new (ReferenceBuilderServiceBase.withBuild(
      builderMock,
      Foo,
    ))();

    expect(service.wrapReference(foo, refMock)).toBe('Foo(12)');
    expect(builderMock).toHaveBeenCalledWith(foo, refMock);
  });

  it('the build method is memoized properly', () => {
    const service = new (ReferenceBuilderServiceBase.withBuild(
      builderMock,
      Foo,
    ))();

    expect(service.wrapReference(foo, refMock)).toBe('Foo(12)');
    expect(service.wrapReference(foo, refMock)).toBe('Foo(12)');
    expect(service.wrapReference(foo, refMock)).toBe('Foo(12)');
    expect(service.wrapReference(foo, refMock)).toBe('Foo(12)');
    expect(service.wrapReference(foo, refMock)).toBe('Foo(12)');
    expect(builderMock).toHaveBeenCalledTimes(1);
    expect(builderMock).toHaveBeenCalledWith(foo, refMock);

    expect(service.wrapReference(otherFoo, refMock)).toBe('Foo(12)');
    expect(builderMock).toHaveBeenCalledTimes(2);
    expect(builderMock).toHaveBeenCalledWith(otherFoo, refMock);
  });

  it('wrapper can be overridden', () => {
    const service = new (ReferenceBuilderServiceBase.withBuild(
      builderMock,
      Foo,
      'Wrapper',
    ))();

    expect(service.wrapReference(foo, refMock)).toBe('Wrapper(12)');
    expect(builderMock).toHaveBeenCalledWith(foo, refMock);
  });

  it('if an empty wrapper is given the build result is used directly', () => {
    const service = new (ReferenceBuilderServiceBase.withBuild(
      builderMock,
      Foo,
      '',
    ))();

    expect(service.wrapReference(foo, refMock)).toBe('12');
    expect(builderMock).toHaveBeenCalledWith(foo, refMock);
  });
});

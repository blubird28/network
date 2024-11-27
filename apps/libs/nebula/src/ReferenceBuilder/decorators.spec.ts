import { ReferencedBy, ReferencedEmpty } from './decorators';
import {
  ReferenceBuilder,
  ReferenceBuilderServiceBase,
} from './reference-builder.service';
import storage from './storage';

describe('Reference decorators', () => {
  describe('ReferencedBy', () => {
    it('adds the appropriate metadata to storage', () => {
      const refBuilder: ReferenceBuilder<Foo> = ({ foo }) => `${foo}`;
      const builderMock = jest.fn(refBuilder);

      @ReferencedBy(builderMock)
      class Foo {
        foo = 12;
      }

      const result = storage.get(Foo);
      expect(result).not.toBeUndefined();
      const service = new result();
      expect(service).toBeInstanceOf(ReferenceBuilderServiceBase);

      expect(service.wrapReference(new Foo(), jest.fn())).toBe('Foo(12)');
    });
    it('adds the appropriate metadata to storage (overridden wrapper)', () => {
      const refBuilder: ReferenceBuilder<Bar> = ({ bar }) => `${bar}`;
      const builderMock = jest.fn(refBuilder);

      @ReferencedBy(builderMock, 'Wrapper')
      class Bar {
        bar = 12;
      }

      const result = storage.get(Bar);
      expect(result).not.toBeUndefined();
      const service = new result();
      expect(service).toBeInstanceOf(ReferenceBuilderServiceBase);

      expect(service.wrapReference(new Bar(), jest.fn())).toBe('Wrapper(12)');
    });
  });

  describe('ReferencedEmpty', () => {
    it('adds the appropriate metadata to storage', () => {
      @ReferencedEmpty()
      class Foo {
        foo = 12;
      }

      const result = storage.get(Foo);
      expect(result).not.toBeUndefined();
      const service = new result();
      expect(service).toBeInstanceOf(ReferenceBuilderServiceBase);

      expect(service.wrapReference(new Foo(), jest.fn())).toBe('Foo()');
    });
    it('adds the appropriate metadata to storage (overridden wrapper)', () => {
      @ReferencedEmpty('Wrapper')
      class Bar {
        bar = 12;
      }

      const result = storage.get(Bar);
      expect(result).not.toBeUndefined();
      const service = new result();
      expect(service).toBeInstanceOf(ReferenceBuilderServiceBase);

      expect(service.wrapReference(new Bar(), jest.fn())).toBe('Wrapper()');
    });
  });
});

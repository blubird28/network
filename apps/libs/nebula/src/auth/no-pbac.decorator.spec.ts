import { NoPBAC } from './no-pbac.decorator';
import { NO_PBAC_KEY } from './constants';

describe('@NoPBAC decorator', () => {
  @NoPBAC()
  class DecoratedClass {}

  class UndecoratedClass {
    @NoPBAC()
    decoratedMethod() {
      return null;
    }
    undecoratedMethod() {
      return null;
    }
  }

  it('applies the expected metadata to a controller', () => {
    expect(Reflect.getMetadata(NO_PBAC_KEY, DecoratedClass)).toBe(true);
    expect(Reflect.getMetadata(NO_PBAC_KEY, UndecoratedClass)).toBeUndefined();
  });

  it('applies the expected metadata to controller methods', () => {
    const instance = new UndecoratedClass();
    expect(Reflect.getMetadata(NO_PBAC_KEY, instance.decoratedMethod)).toBe(
      true,
    );
    expect(
      Reflect.getMetadata(NO_PBAC_KEY, instance.undecoratedMethod),
    ).toBeUndefined();
  });
});

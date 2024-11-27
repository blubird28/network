import { Public } from './public.decorator';
import { IS_PUBLIC_KEY } from './constants';

describe('@Public decorator', () => {
  @Public()
  class TestPublicClass {}

  class TestPrivateClass {}

  class TestClassWithMethods {
    @Public()
    public() {
      return null;
    }

    private() {
      return null;
    }
  }

  it('applies the expected metadata to a controller', () => {
    expect(Reflect.getMetadata(IS_PUBLIC_KEY, TestPublicClass)).toBe(true);
    expect(
      Reflect.getMetadata(IS_PUBLIC_KEY, TestPrivateClass),
    ).toBeUndefined();
  });

  it('applies the expected metadata to controller methods', () => {
    const instance = new TestClassWithMethods();
    expect(Reflect.getMetadata(IS_PUBLIC_KEY, instance.public)).toBe(true);
    expect(
      Reflect.getMetadata(IS_PUBLIC_KEY, instance.private),
    ).toBeUndefined();
  });
});

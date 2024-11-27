import { AccessCheckDto } from '../dto/access-check.dto';
import { faker } from '../testing/data/fakers';

import { PBAC_KEY } from './constants';
import { PBAC } from './pbac.decorator';

describe('@PBAC decorator', () => {
  const accessCheckFn = () => faker(AccessCheckDto);
  @PBAC(accessCheckFn)
  class ControllerWithPBAC {}
  class ControllerWithoutPBAC {
    methodWithoutPbac() {
      return null;
    }

    @PBAC(accessCheckFn)
    methodWithPbac() {
      return null;
    }
  }

  it('applies the expected metadata to a controller', () => {
    expect(Reflect.getMetadata(PBAC_KEY, ControllerWithPBAC)).toBe(
      accessCheckFn,
    );
    expect(
      Reflect.getMetadata(PBAC_KEY, ControllerWithoutPBAC),
    ).toBeUndefined();
  });

  it('applies the expected metadata to controller methods', () => {
    const instance = new ControllerWithoutPBAC();
    expect(Reflect.getMetadata(PBAC_KEY, instance.methodWithPbac)).toBe(
      accessCheckFn,
    );
    expect(
      Reflect.getMetadata(PBAC_KEY, instance.methodWithoutPbac),
    ).toBeUndefined();
  });
});

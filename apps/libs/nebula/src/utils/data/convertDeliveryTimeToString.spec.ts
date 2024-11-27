import { DeliveryTimeUnitEnum } from '@libs/nebula/dto/legacy-api/legacy-marketplace-productSpec.dto';

import { deliveryTimetoString } from './convertDeliveryTimeToString';

describe('deliveryTimetoString', () => {
  it('returns a string concatenating unit and duration', () => {
    expect.hasAssertions();
    expect(
      deliveryTimetoString({ unit: DeliveryTimeUnitEnum.hour, duration: 1 }),
    ).toBe('1 hour');
  });

  it('returns unit in the plural when duration > 1', () => {
    expect.hasAssertions();

    expect(
      deliveryTimetoString({ unit: DeliveryTimeUnitEnum.day, duration: 2 }),
    ).not.toBe('2 day');

    expect(
      deliveryTimetoString({ unit: DeliveryTimeUnitEnum.day, duration: 2 }),
    ).toBe('2 days');
  });
});

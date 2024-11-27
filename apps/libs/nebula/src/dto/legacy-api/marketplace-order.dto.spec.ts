import { ClassSerializerInterceptor } from '@nestjs/common';

import { BaseValidationPipe } from '../../Error';
import { faker } from '../../testing/data/fakers';
import {
  FAKE_OBJECT_ID,
  FAKE_ORDER_ATTRIBUTES,
  FAKE_UUID,
  FIRST_JAN_2020,
} from '../../testing/data/constants';

import { MarketplaceOrderDto } from './marketplace-order.dto';

describe('MarketplaceOrderDto', () => {
  let validator: BaseValidationPipe;
  let serializer: ClassSerializerInterceptor;
  const deserialized = faker(MarketplaceOrderDto);
  const serialized = {
    id: FAKE_UUID,
    companyId: FAKE_OBJECT_ID,
    productOfferingId: FAKE_UUID,
    productSpecificationId: FAKE_UUID,
    serviceId: FAKE_UUID,
    attributes: FAKE_ORDER_ATTRIBUTES,
    created_at: FIRST_JAN_2020,
    customerReference: 'customer-reference',
    name: 'order-name',
    status: 'PROCESSING',
    monthlyRecurringCost: 10.8,
    nonRecurringCost: 10.8,
    totalContractValue: 10.8,
  };

  beforeEach(() => {
    validator = new BaseValidationPipe(MarketplaceOrderDto);
    serializer = new ClassSerializerInterceptor(null);
  });

  it('can be validated (deserialized)', async () => {
    expect(
      await validator.transform(serialized, {
        type: 'body',
      }),
    ).toStrictEqual(deserialized);
  });

  it('can be serialized', async () => {
    expect(await serializer.serialize(deserialized, {})).toStrictEqual(
      serialized,
    );
  });
});

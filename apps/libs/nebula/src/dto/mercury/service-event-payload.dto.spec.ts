import { ClassSerializerInterceptor } from '@nestjs/common';

import { BaseValidationPipe } from '@libs/nebula/Error';
import { faker } from '@libs/nebula/testing/data/fakers';
import { ServiceEventPayloadDto } from '@libs/nebula/dto/mercury/service-event-payload.dto';
import {
  FAKE_OBJECT_ID,
  FAKE_ORDER_ATTRIBUTES,
  FAKE_UUID,
  FIRST_JAN_2020,
} from '@libs/nebula/testing/data/constants';

describe('ServiceEventPayloadDto', () => {
  let validator: BaseValidationPipe;
  let serializer: ClassSerializerInterceptor;
  const deserialized = faker(ServiceEventPayloadDto);
  const serialized = {
    id: FAKE_UUID,
    companyId: FAKE_OBJECT_ID,
    productOfferingId: FAKE_UUID,
    orderIds: [FAKE_UUID],
    attributes: FAKE_ORDER_ATTRIBUTES,
    created_at: FIRST_JAN_2020,
    updated_at: FIRST_JAN_2020,
    name: 'compute resources',
    status: 'ACTIVE',
  };

  beforeEach(() => {
    validator = new BaseValidationPipe(ServiceEventPayloadDto);
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

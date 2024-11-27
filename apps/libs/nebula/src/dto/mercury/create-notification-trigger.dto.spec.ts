import { ClassSerializerInterceptor } from '@nestjs/common';

import * as transformer from '@libs/nebula/class-transformer';

import Errors, { BaseValidationPipe } from '../../Error';
import { faker } from '../../testing/data/fakers';

import { CreateNotificationTriggerDto } from './create-notification-trigger.dto';

describe('CreateNotificationTriggerDto', () => {
  let validator: BaseValidationPipe;
  let serializer: ClassSerializerInterceptor;
  const deserialized = faker(CreateNotificationTriggerDto);
  const serialized = {
    name: 'when order placed',
    patternMatch: '{"eventType":"USER_TASK_CREATED"}',
    payloadMatch: { status: 'ACTIVE' },
  };

  beforeEach(() => {
    validator = new BaseValidationPipe(CreateNotificationTriggerDto);
    serializer = new ClassSerializerInterceptor(null, {
      transformerPackage: transformer,
    });
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

  it('payloadMatch is a valid serialized object', async () => {
    await expect(
      validator.transform(
        { ...serialized, payloadMatch: 'not an object' },
        {
          type: 'body',
        },
      ),
    ).rejects.toThrowError(Errors.InvalidPayloadMatcher);
  });
});

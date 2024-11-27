import { ClassSerializerInterceptor } from '@nestjs/common';

import * as transformer from '@libs/nebula/class-transformer';

import Errors, { BaseValidationPipe } from '../../Error';
import { faker } from '../../testing/data/fakers';
import { FAKE_UUID } from '../../testing/data/constants';

import { CreateNotificationDto } from './create-notification.dto';

describe('CreateNotificationDto', () => {
  let validator: BaseValidationPipe;
  let serializer: ClassSerializerInterceptor;
  const serializedWithoutDryRun = {
    triggerId: FAKE_UUID,
    name: 'Send Order Created Slack message to support',
    handler: 'SLACK_SEND_TO_DEFAULT',
    template: [
      {
        attachments: [
          { text: 'An order has been placed by <%= srcCompany.name %>' },
        ],
      },
    ],
  };
  const serializedWithDryRun = {
    ...serializedWithoutDryRun,
    dryRun: true,
  };
  const deserializedWithDryRun = faker(
    CreateNotificationDto,
    serializedWithDryRun,
  );
  const deserializedWithoutDryRun = faker(
    CreateNotificationDto,
    serializedWithoutDryRun,
  );
  deserializedWithoutDryRun.dryRun = undefined;

  beforeEach(() => {
    validator = new BaseValidationPipe(CreateNotificationDto);
    serializer = new ClassSerializerInterceptor(null, {
      transformerPackage: transformer,
    });
  });

  it('can be validated (deserialized) without optional properties', async () => {
    expect(
      await validator.transform(serializedWithoutDryRun, {
        type: 'body',
      }),
    ).toStrictEqual(deserializedWithoutDryRun);
  });

  it('can be validated (deserialized) with optional properties', async () => {
    expect(
      await validator.transform(serializedWithDryRun, {
        type: 'body',
      }),
    ).toStrictEqual(deserializedWithDryRun);
  });

  it('can be serialized', () => {
    expect(serializer.serialize(deserializedWithDryRun, {})).toStrictEqual(
      serializedWithDryRun,
    );
  });

  it('paramTemplate is valid serialized data', async () => {
    await expect(
      validator.transform(
        {
          ...serializedWithoutDryRun,
          template: { unserializable: () => true },
        },
        {
          type: 'body',
        },
      ),
    ).rejects.toThrowError(Errors.InvalidTemplate);
  });
});

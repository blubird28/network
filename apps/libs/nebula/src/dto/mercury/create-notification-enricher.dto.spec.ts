import { ClassSerializerInterceptor } from '@nestjs/common';

import * as transformer from '@libs/nebula/class-transformer';

import Errors, { BaseValidationPipe } from '../../Error';
import { faker } from '../../testing/data/fakers';
import { FAKE_UUID } from '../../testing/data/constants';

import { CreateNotificationEnricherDto } from './create-notification-enricher.dto';

describe('CreateNotificationEnricherDto', () => {
  let validator: BaseValidationPipe;
  let serializer: ClassSerializerInterceptor;
  const serializedWithoutDryRun = {
    triggerId: FAKE_UUID,
    key: 'srcCompany',
    handler: 'GET_COMPANY',
    paramTemplate: ['<%= eventPayload.srcCompanyId %>'],
  };

  const serializedWithDryRun = {
    ...serializedWithoutDryRun,
    dryRun: true,
  };
  const deserializedWithDryRun = faker(
    CreateNotificationEnricherDto,
    serializedWithDryRun,
  );
  const deserializedWithoutDryRun = faker(
    CreateNotificationEnricherDto,
    serializedWithoutDryRun,
  );
  deserializedWithoutDryRun.dryRun = undefined;

  beforeEach(() => {
    validator = new BaseValidationPipe(CreateNotificationEnricherDto);
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
          paramTemplate: { unserializable: () => true },
        },
        {
          type: 'body',
        },
      ),
    ).rejects.toThrowError(Errors.InvalidTemplate);
  });
});

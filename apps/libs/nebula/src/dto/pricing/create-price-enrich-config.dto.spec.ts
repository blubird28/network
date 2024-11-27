import { ClassSerializerInterceptor } from '@nestjs/common';

import * as transformer from '@libs/nebula/class-transformer';

import { FAKE_UUID } from '../../testing/data/constants';
import Errors, { BaseValidationPipe } from '../../Error';
import { faker } from '../../testing/data/fakers';

import { CreatePriceEnrichConfigDto } from './create-price-enrich-config.dto';

describe('CreatePriceEnrichConfigDto', () => {
  let validator: BaseValidationPipe;
  let serializer: ClassSerializerInterceptor;
  const deserialized = faker(
    CreatePriceEnrichConfigDto,
    { product: null },
    { transform: { exposeUnsetFields: true } },
  );
  const deserializedWithProduct = faker(CreatePriceEnrichConfigDto, {
    product: FAKE_UUID,
  });
  const serialized = {
    handler: 'GET_DCF_COSTBOOK_LOCATION',
    key: 'costbookLocation',
    paramTemplate: ['<%= priceRequest.dcfId %>'],
    resultTemplate: '<%= result.name %>',
    priceKey: 'widget_price_final',
  };
  const serializedWithProduct = {
    ...serialized,
    product: FAKE_UUID,
  };

  beforeEach(() => {
    validator = new BaseValidationPipe(CreatePriceEnrichConfigDto);
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
    expect(
      serializer.serialize(deserialized, { exposeUnsetFields: false }),
    ).toStrictEqual({
      ...serialized,
    });
  });

  it('can be validated (deserialized) - with product', async () => {
    expect(
      await validator.transform(serializedWithProduct, {
        type: 'body',
      }),
    ).toStrictEqual(deserializedWithProduct);
  });

  it('can be serialized - with product', async () => {
    expect(serializer.serialize(deserializedWithProduct, {})).toStrictEqual(
      serializedWithProduct,
    );
  });

  it('paramTemplate is valid serialized data', async () => {
    await expect(
      validator.transform(
        { ...serialized, paramTemplate: { unserializable: () => true } },
        {
          type: 'body',
        },
      ),
    ).rejects.toThrowError(Errors.InvalidTemplate);
  });
});

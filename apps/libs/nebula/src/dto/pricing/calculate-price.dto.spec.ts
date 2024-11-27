import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

import { CalculatePriceDto, AddonDto } from './calculate-price.dto';

describe('CalculatePriceDto', () => {
  it('should handle an old version of the DTO without productOfferingId and addons', async () => {
    const oldPlainObject = {
      priceKey: 'widget_price_final',
      product: 'widget',
      attributes: {
        businessType: 'VALUE2',
      },
      schema: {
        $id: 'test.json#',
        type: 'object',
        properties: {
          sku: { type: 'string' },
          businessType: { type: 'string', enum: ['ENTERPRISE', 'VALUE2'] },
        },
        required: ['businessType'],
      },
      // No productOfferingId and addons
    };

    const dto = plainToClass(CalculatePriceDto, oldPlainObject);
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
    expect(dto.priceKey).toBe('widget_price_final');
    expect(dto.product).toBe('widget');

    expect(dto.schema).toEqual({
      $id: 'test.json#',
      type: 'object',
      properties: {
        sku: { type: 'string' },
        businessType: { type: 'string', enum: ['ENTERPRISE', 'VALUE2'] },
      },
      required: ['businessType'],
    });

    expect(dto.productOfferingId).toBeUndefined();
    expect(dto.addons).toBeUndefined();
  });

  it('should successfully validate and transform CalculatePriceDto', async () => {
    const expectedProductOfferingId = '6409c399-9a28-4c0f-bada-f78968c53910';
    const expectedBusinessType = 'ENTERPRISE';
    const expectedAddonProductOfferingId =
      '681e0ff8-4de5-4138-bc34-45dd92e57ea0';
    const expectedAddonBusinessType = 'VALUE2';

    const plainObject = {
      productOfferingId: expectedProductOfferingId,
      attributes: {
        businessType: expectedBusinessType,
      },
      addons: [
        {
          productOfferingId: expectedAddonProductOfferingId,
          attributes: {
            businessType: expectedAddonBusinessType,
          },
        },
      ],
    };

    const dto = plainToClass(CalculatePriceDto, plainObject);
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
    expect(dto.productOfferingId).toBe(expectedProductOfferingId);
    expect(dto.attributes['businessType']).toBe(expectedBusinessType);

    expect(dto.addons).toHaveLength(1);
    const addon = dto.addons[0];
    expect(addon.productOfferingId).toBe(expectedAddonProductOfferingId);
    expect(addon.attributes['businessType']).toBe(expectedAddonBusinessType);
  });

  it('should fail validation when required fields are missing', async () => {
    const invalidPlainObject = {
      product: 'widget',
      productOfferingId: '6409c399-9a28-4c0f-bada-f78968c53910',
      // Missing attributes which is required
    };
    const dto = plainToClass(CalculatePriceDto, invalidPlainObject);
    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
    expect(
      errors.find((error) => error.property === 'attributes'),
    ).toBeDefined();
  });

  it('should handle optional fields correctly', async () => {
    const plainObject = {
      priceKey: 'widget_price_final',
      product: 'widget',
      productOfferingId: '6409c399-9a28-4c0f-bada-f78968c53910',
      attributes: {
        businessType: 'ENTERPRISE',
      },
    };

    const dto = plainToClass(CalculatePriceDto, plainObject);
    const errors = await validate(dto);

    expect(errors.length).toBe(0);
    expect(dto.schema).toBeUndefined();
    expect(dto.addons).toBeUndefined();
  });
  it('should handle the valid fields in addons', async () => {
    const plainAddonObject = {
      // productOfferingId is missing
      // productOfferingId: '681e0ff8-4de5-4138-bc34-45dd92e57ea0',
      attributes: {
        addonType: 'VALUE2',
      },
    };

    const addonDto = plainToClass(AddonDto, plainAddonObject);
    const errors = await validate(addonDto);
    expect(errors.length).toBeGreaterThan(0);
    expect(addonDto.productOfferingId).toBeUndefined();
    expect(addonDto.attributes['addonType']).toBe('VALUE2');
  });
  it('should correctly transform and validate AddonDto', async () => {
    const plainAddonObject = {
      productOfferingId: '681e0ff8-4de5-4138-bc34-45dd92e57ea0',
      attributes: {
        addonType: 'VALUE2',
      },
    };

    const addonDto = plainToClass(AddonDto, plainAddonObject);
    const errors = await validate(addonDto);

    expect(errors.length).toBe(0);
    expect(addonDto.productOfferingId).toBe(
      '681e0ff8-4de5-4138-bc34-45dd92e57ea0',
    );
    expect(addonDto.attributes['addonType']).toBe('VALUE2');
  });

  it('should correctly transform and multiple validate AddonDtos', async () => {
    const plainAddonObject1 = {
      productOfferingId: '681e0ff8-4de5-4138-bc34-45dd92e57ea0',
      attributes: {
        addonType: 'VALUE2',
      },
    };

    const plainAddonObject2 = {
      productOfferingId: '681e0ff8-4de5-4138-bc34-45dd92e57ea1',
      attributes: {
        addonType: 'ENTERPRISE',
      },
    };

    const addonDto1 = plainToClass(AddonDto, plainAddonObject1);
    const errors1 = await validate(addonDto1);

    expect(errors1.length).toBe(0);
    expect(addonDto1.productOfferingId).toBe(
      '681e0ff8-4de5-4138-bc34-45dd92e57ea0',
    );
    expect(addonDto1.attributes['addonType']).toBe('VALUE2');

    const addonDto2 = plainToClass(AddonDto, plainAddonObject2);
    const errors2 = await validate(addonDto2);

    expect(errors2.length).toBe(0);
    expect(addonDto2.productOfferingId).toBe(
      '681e0ff8-4de5-4138-bc34-45dd92e57ea1',
    );
    expect(addonDto2.attributes['addonType']).toBe('ENTERPRISE');
  });
});

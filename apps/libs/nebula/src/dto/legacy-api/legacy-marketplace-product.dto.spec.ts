import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import { LegacyMarketplaceProductDto } from './legacy-marketplace-product.dto';

describe('LegacyMarketplaceProductDto', () => {
  const validDto = {
    id: 'd29a86fb-92d2-4693-8155-57c5c1687f3c',
    companyId: '507f1f77bcf86cd799439011',
    dataCenterFacilityId: '507f1f77bcf86cd799439012',
    status: 'PUBLISHED',
    transactionType: 'MARKETPLACE',
    productType: 'Compute',
    promoted: false,
    name: 'A New Compute Type',
    headline: 'Come buy our new Product!',
    description: 'A cool new thing.',
    logo: 'logo.png',
    overviewImage: 'overview-image.png',
    background: 'Some extra information.',
    categories: ['category-1', 'category-3'],
    tags: ['new'],
    promoTitle: 'New Deal!',
    promoHeadline: 'Hurry ends soon.',
    callToActionLabel: 'Click here to action.',
    callToActionLink: 'https://action.link',
    hubspotFormId: 'HUB-PDT-111',
    isChargeable: true,
  };

  it('should validate a valid DTO', async () => {
    const dtoInstance = plainToInstance(LegacyMarketplaceProductDto, validDto);
    const errors = await validate(dtoInstance);
    expect(errors.length).toBe(0); // No errors for valid data
  });

  it('should fail validation when a required field is missing', async () => {
    const invalidDto = { ...validDto, id: '' }; // Invalid id
    const dtoInstance = plainToInstance(
      LegacyMarketplaceProductDto,
      invalidDto,
    );
    const errors = await validate(dtoInstance);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('id');
  });

  it('should fail validation with an invalid enum value for status', async () => {
    const invalidDto = { ...validDto, status: 'INVALID_STATUS' }; // Invalid status
    const dtoInstance = plainToInstance(
      LegacyMarketplaceProductDto,
      invalidDto,
    );
    const errors = await validate(dtoInstance);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('status');
  });

  it('should fail validation with an invalid enum value for transactionType', async () => {
    const invalidDto = {
      ...validDto,
      transactionType: 'INVALID_TRANSACTION_TYPE',
    }; // Invalid transactionType
    const dtoInstance = plainToInstance(
      LegacyMarketplaceProductDto,
      invalidDto,
    );
    const errors = await validate(dtoInstance);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('transactionType');
  });

  it('should fail validation when isChargeable is not a boolean', async () => {
    const invalidDto = { ...validDto, isChargeable: 'notBoolean' }; // Invalid boolean
    const dtoInstance = plainToInstance(
      LegacyMarketplaceProductDto,
      invalidDto,
    );
    const errors = await validate(dtoInstance);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('isChargeable');
    expect(errors[0].constraints?.isBoolean).toBeDefined();
  });

  it('should pass validation with optional fields missing', async () => {
    const partialDto = {
      ...validDto,
      companyId: undefined,
      dataCenterFacilityId: undefined,
      logo: undefined,
      overviewImage: undefined,
      callToActionLink: undefined,
      hubspotFormId: undefined,
      isChargeable: undefined,
    };
    const dtoInstance = plainToInstance(
      LegacyMarketplaceProductDto,
      partialDto,
    );
    const errors = await validate(dtoInstance);
    expect(errors.length).toBe(0); // No errors when optional fields are missing
  });

  it('should fail validation when description is missing', async () => {
    const invalidDto = { ...validDto, description: '' }; // Empty description
    const dtoInstance = plainToInstance(
      LegacyMarketplaceProductDto,
      invalidDto,
    );
    const errors = await validate(dtoInstance);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('description');
  });

  it('should pass validation with isChargeable set to true', async () => {
    const partialDto = {
      ...validDto,
      isChargeable: true, // Explicitly setting this optional boolean field to true
    };

    const dtoInstance = plainToInstance(
      LegacyMarketplaceProductDto,
      partialDto,
    );

    const errors = await validate(dtoInstance);
    expect(errors.length).toBe(0); // No errors when isChargeable is true
  });

  it('should pass validation with isChargeable set to false', async () => {
    const partialDto = {
      ...validDto,
      isChargeable: false,
    };

    const dtoInstance = plainToInstance(
      LegacyMarketplaceProductDto,
      partialDto,
    );

    const errors = await validate(dtoInstance);
    expect(errors.length).toBe(0);
  });

  it('should pass validation with isChargeable set to a string(false)', async () => {
    const partialDto = {
      ...validDto,
      isChargeable: 'false',
    };

    const dtoInstance = plainToInstance(
      LegacyMarketplaceProductDto,
      partialDto,
    );
    const errors = await validate(dtoInstance);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('isChargeable');
    expect(errors[0].constraints.isBoolean).toBe(
      'isChargeable must be a boolean value',
    );
  });
});

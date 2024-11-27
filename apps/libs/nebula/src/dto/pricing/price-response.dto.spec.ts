import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

import {
  AddonResponseDto,
  AggregatePriceResponseDto,
  PriceResponseDto,
} from './price-response.dto';

describe('PriceResponseDto', () => {
  it('should correctly transform and validate a PriceResponseDto instance', async () => {
    const plainPriceDto = {
      monthlyRecurringCost: 120.0,
      nonRecurringCost: 1000.0,
      totalContractValue: 1120.0,
      usageCharge: 0.0,
      usageChargeUnit: 'GB',
    };

    const priceDto = plainToClass(PriceResponseDto, plainPriceDto);
    const errors = await validate(priceDto);

    expect(errors.length).toBe(0);
    expect(priceDto.monthlyRecurringCost).toBe(120.0);
    expect(priceDto.nonRecurringCost).toBe(1000.0);
    expect(priceDto.totalContractValue).toBe(1120.0);
    expect(priceDto.usageCharge).toBe(0.0);
    expect(priceDto.usageChargeUnit).toBe('GB');
  });

  it('should correctly transform and validate an AggregatePriceResponseDto instance', async () => {
    const plainAggregateDto = {
      monthlyRecurringCost: 70.0,
      nonRecurringCost: 800.0,
      totalContractValue: 870.0,
    };

    const aggregateDto = plainToClass(
      AggregatePriceResponseDto,
      plainAggregateDto,
    );
    const errors = await validate(aggregateDto);
    expect(errors.length).toBe(0);
    expect(aggregateDto.monthlyRecurringCost).toBe(70.0);
    expect(aggregateDto.nonRecurringCost).toBe(800.0);
    expect(aggregateDto.totalContractValue).toBe(870.0);
  });

  it('should correctly transform and validate a full PriceResponseDto with product, aggregate, and add-ons', async () => {
    const plainDto = {
      monthlyRecurringCost: 50.0,
      nonRecurringCost: 200.0,
      totalContractValue: 250.0,
      usageCharge: 0.0,
      usageChargeUnit: 'GB',
      aggregate: {
        monthlyRecurringCost: 70.0,
        nonRecurringCost: 800.0,
        totalContractValue: 870.0,
      },
      addons: [
        {
          monthlyRecurringCost: 20.0,
          nonRecurringCost: 100.0,
          totalContractValue: 120.0,
          usageCharge: 0.0,
          usageChargeUnit: 'GB',
          productOfferingId: '97df9247-8347-4864-8603-6945494c2460',
          isChargeable: true,
        },
        {
          monthlyRecurringCost: null,
          nonRecurringCost: null,
          totalContractValue: null,
          usageCharge: null,
          usageChargeUnit: null,
          productOfferingId: '4a72e887-9154-430a-9d55-abdaa9eb2da7',
          isChargeable: false,
        },
      ],
    };

    const priceDto = plainToClass(PriceResponseDto, plainDto);
    const errors = await validate(priceDto);

    expect(errors.length).toBe(0);
    expect(priceDto.aggregate).toBeDefined();
    expect(priceDto.addons).toBeDefined();
    expect(priceDto.addons.length).toBe(2);
    expect(priceDto.addons[0].productOfferingId).toBe(
      '97df9247-8347-4864-8603-6945494c2460',
    );
    expect(priceDto.addons[1].productOfferingId).toBe(
      '4a72e887-9154-430a-9d55-abdaa9eb2da7',
    );
  });
});

describe('AddonResponseDto', () => {
  it('should transform and validate a plain chargeable instance', async () => {
    const plainDto = {
      monthlyRecurringCost: 20.0,
      nonRecurringCost: 100.0,
      totalContractValue: 120.0,
      usageCharge: 0.0,
      usageChargeUnit: 'GB',
      productOfferingId: '60951637-d94e-402c-a581-0d1e416589fe',
      isChargeable: true,
    };

    const priceDto = plainToClass(AddonResponseDto, plainDto);
    const errors = await validate(priceDto);

    expect(errors).toHaveLength(0);
    expect(priceDto.monthlyRecurringCost).toBe(20.0);
    expect(priceDto.nonRecurringCost).toBe(100.0);
    expect(priceDto.totalContractValue).toBe(120.0);
    expect(priceDto.usageCharge).toBe(0.0);
    expect(priceDto.usageChargeUnit).toBe('GB');
    expect(priceDto.productOfferingId).toBe(
      '60951637-d94e-402c-a581-0d1e416589fe',
    );
    expect(priceDto.isChargeable).toBe(true);
  });

  it('should transform and validate a plain non-chargeable instance', async () => {
    const plainDto = {
      monthlyRecurringCost: null,
      nonRecurringCost: null,
      totalContractValue: null,
      usageCharge: null,
      usageChargeUnit: null,
      productOfferingId: '66539d2a-6790-499f-acf5-4098e1ee51e4',
      isChargeable: false,
    };

    const priceDto = plainToClass(AddonResponseDto, plainDto);
    const errors = await validate(priceDto);

    expect(errors).toHaveLength(0);
    expect(priceDto.monthlyRecurringCost).toBe(null);
    expect(priceDto.nonRecurringCost).toBe(null);
    expect(priceDto.totalContractValue).toBe(null);
    expect(priceDto.usageCharge).toBe(null);
    expect(priceDto.usageChargeUnit).toBe(null);
    expect(priceDto.productOfferingId).toBe(
      '66539d2a-6790-499f-acf5-4098e1ee51e4',
    );
    expect(priceDto.isChargeable).toBe(false);
  });

  it('should fail validation when isChargeable is not provided', async () => {
    const plainDto = {
      monthlyRecurringCost: 20.0,
      nonRecurringCost: 100.0,
      totalContractValue: 120.0,
      usageCharge: 0.0,
      usageChargeUnit: 'GB',
      productOfferingId: '134e41a6-caba-4340-a09c-bc008bd0c06b',
    };

    const priceDto = plainToClass(AddonResponseDto, plainDto);
    const errors = await validate(priceDto);

    expect(errors).not.toHaveLength(0);
  });

  it('should fail validation when isChargeable is true but pricing fields are not provided', async () => {
    const plainDto = {
      monthlyRecurringCost: null,
      nonRecurringCost: null,
      totalContractValue: null,
      usageCharge: null,
      usageChargeUnit: null,
      productOfferingId: 'bb6edc9b-2020-4cf4-ac87-4def831c9802',
      isChargeable: true,
    };

    const priceDto = plainToClass(AddonResponseDto, plainDto);
    const errors = await validate(priceDto);

    expect(errors).not.toHaveLength(0);
  });

  it('should pass validation when isChargeable is false and pricing fields are not provided', async () => {
    const plainDto = {
      monthlyRecurringCost: null,
      nonRecurringCost: null,
      totalContractValue: null,
      usageCharge: null,
      usageChargeUnit: null,
      productOfferingId: '4ae8abfd-75c6-427a-b4dc-85e61efde45b',
      isChargeable: false,
    };

    const priceDto = plainToClass(AddonResponseDto, plainDto);
    const errors = await validate(priceDto);

    expect(errors).toHaveLength(0);
  });
});

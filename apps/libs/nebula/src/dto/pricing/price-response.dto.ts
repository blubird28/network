import { Expose, Transform, TransformFnParams, Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  Validate,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { isNumber } from 'lodash';

import {
  FAKE_PRICE,
  FAKE_PRICE_UNIT,
} from '@libs/nebula/testing/data/constants';
import BooleanProp from '@libs/nebula/dto/decorators/BooleanProp.decorator';

import { DTOFaker } from '../../testing/data/fakers/decorators/Faker';
import { Fake } from '../../testing/data/fakers';
import { ExternalType } from '../../utils/external-type';

import { IsPositiveOrZero } from './validators/is-positive-or-zero.validator';

export const DEFAULT_WIDTH = 8;
export const toFixedWidthDecimal =
  (width = DEFAULT_WIDTH) =>
  ({ value }: TransformFnParams) => {
    if (isNumber(value) && isFinite(value)) {
      return parseFloat(value.toFixed(width));
    }
    return value;
  };

@ExternalType()
@DTOFaker()
export class BasePriceResponseDto {
  @Fake(FAKE_PRICE)
  @Expose()
  @Type(() => Number)
  @IsNotEmpty()
  @Validate(IsPositiveOrZero)
  @Transform(toFixedWidthDecimal())
  readonly monthlyRecurringCost: number;

  @Fake(FAKE_PRICE)
  @Expose()
  @Type(() => Number)
  @IsNotEmpty()
  @Validate(IsPositiveOrZero)
  @Transform(toFixedWidthDecimal())
  readonly nonRecurringCost: number;

  @Fake(FAKE_PRICE)
  @Expose()
  @Type(() => Number)
  @IsNotEmpty()
  @Validate(IsPositiveOrZero)
  @Transform(toFixedWidthDecimal())
  readonly totalContractValue: number;

  @Fake(FAKE_PRICE)
  @Expose()
  @Type(() => Number)
  @IsNotEmpty()
  @Validate(IsPositiveOrZero)
  @Transform(toFixedWidthDecimal())
  readonly usageCharge: number;

  @Fake(FAKE_PRICE_UNIT)
  @Expose()
  @Type(() => String)
  @IsNotEmpty()
  readonly usageChargeUnit: string;
}

/**
 * Represents a pricing result for an add-on.
 *
 * Pricing fields (`monthlyRecurringCost`, `usageCharge` etc.) are only validated when `isChargeable` is true.
 */
@ExternalType()
@DTOFaker()
export class AddonResponseDto {
  @Fake('97df9247-8347-4864-8603-6945494c2460')
  @Expose()
  @Type(() => String)
  @IsNotEmpty()
  readonly productOfferingId: string;

  @BooleanProp({
    optional: false,
    fake: true,
  })
  readonly isChargeable: boolean;

  @Fake(FAKE_PRICE)
  @Expose()
  @Type(() => Number)
  @IsNotEmpty()
  @Validate(IsPositiveOrZero)
  @Transform(toFixedWidthDecimal())
  @ValidateIf((o) => o.isChargeable)
  readonly monthlyRecurringCost: number;

  @Fake(FAKE_PRICE)
  @Expose()
  @Type(() => Number)
  @IsNotEmpty()
  @Validate(IsPositiveOrZero)
  @Transform(toFixedWidthDecimal())
  @ValidateIf((o) => o.isChargeable)
  readonly nonRecurringCost: number;

  @Fake(FAKE_PRICE)
  @Expose()
  @Type(() => Number)
  @IsNotEmpty()
  @Validate(IsPositiveOrZero)
  @Transform(toFixedWidthDecimal())
  @ValidateIf((o) => o.isChargeable)
  readonly totalContractValue: number;

  @Fake(FAKE_PRICE)
  @Expose()
  @Type(() => Number)
  @IsNotEmpty()
  @Validate(IsPositiveOrZero)
  @Transform(toFixedWidthDecimal())
  @ValidateIf((o) => o.isChargeable)
  readonly usageCharge: number;

  @Fake(FAKE_PRICE_UNIT)
  @Expose()
  @Type(() => String)
  @IsNotEmpty()
  @ValidateIf((o) => o.isChargeable)
  readonly usageChargeUnit: string;
}

@ExternalType()
@DTOFaker()
export class AggregatePriceResponseDto {
  @Fake(FAKE_PRICE)
  @Expose()
  @Type(() => Number)
  @IsNotEmpty()
  @Validate(IsPositiveOrZero)
  @Transform(toFixedWidthDecimal())
  readonly monthlyRecurringCost: number;

  @Fake(FAKE_PRICE)
  @Expose()
  @Type(() => Number)
  @IsNotEmpty()
  @Validate(IsPositiveOrZero)
  @Transform(toFixedWidthDecimal())
  readonly nonRecurringCost: number;

  @Fake(FAKE_PRICE)
  @Expose()
  @Type(() => Number)
  @IsNotEmpty()
  @Validate(IsPositiveOrZero)
  @Transform(toFixedWidthDecimal())
  readonly totalContractValue: number;
}

@ExternalType()
@DTOFaker()
export class PriceResponseDto extends BasePriceResponseDto {
  @Expose()
  @ValidateNested()
  @Type(() => AggregatePriceResponseDto)
  @IsOptional()
  readonly aggregate?: AggregatePriceResponseDto;

  @Expose()
  @ValidateNested({ each: true })
  @Type(() => AddonResponseDto)
  @IsOptional()
  readonly addons?: AddonResponseDto[];
}

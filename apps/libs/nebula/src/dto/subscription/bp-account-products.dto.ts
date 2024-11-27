import { Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsISO8601,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';

import {
  FAKE_COMMON_VALUE,
  FAKE_CURRENCY_CODE,
  FAKE_ISO8601_DATE,
  FAKE_OBJECT_ID,
  FAKE_PRICE,
  FAKE_RATING_METHOD,
  FAKE_PACKAGE_PRODUCT_ID,
} from '@libs/nebula/testing/data/constants';
import Errors from '@libs/nebula/Error';
import {
  MAX_LENGTH_50,
  RATING_METHODS,
} from '@libs/nebula/subscription/subscription.constants';

import { DTOFaker } from '../../testing/data/fakers/decorators/Faker';
import { Fake, DeepFakeMany } from '../../testing/data/fakers';
import { ExternalType } from '../../utils/external-type';

import { BPAttributesDto } from './bp-attributes.dto';

@ExternalType()
@DTOFaker()
export class BPAccountProductsDto {
  @Fake(FAKE_OBJECT_ID)
  @Expose({ name: 'productId' })
  @MaxLength(MAX_LENGTH_50)
  @IsNotEmpty({ context: Errors.InvalidProductId.context })
  @Type(() => String)
  readonly productId: string;

  @Fake(FAKE_PACKAGE_PRODUCT_ID)
  @Expose({ name: 'packageProductId' })
  @MaxLength(MAX_LENGTH_50)
  @IsNotEmpty({ context: Errors.InvalidPackageProductId.context })
  @Type(() => String)
  readonly packageProductId: string;

  @Fake(FAKE_ISO8601_DATE)
  @Expose({ name: 'startDate' })
  @IsNotEmpty()
  @IsISO8601()
  @Type(() => String)
  public readonly startDate: string;

  @Fake(FAKE_OBJECT_ID)
  @Expose({ name: 'billingAccountId' })
  @MaxLength(MAX_LENGTH_50)
  @IsNotEmpty({ context: Errors.InvalidBillingAccountId.context })
  @Type(() => String)
  readonly accountId: string;

  @Fake(FAKE_ISO8601_DATE)
  @Expose({ name: 'renewalDate' })
  @IsISO8601()
  @IsOptional()
  @Type(() => String)
  readonly renewalDate?: string;

  @Fake(FAKE_COMMON_VALUE)
  @Expose({ name: 'quantity' })
  @MaxLength(MAX_LENGTH_50)
  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  readonly quantity: string;

  @Fake(FAKE_PRICE)
  @Expose({ name: 'rate' })
  @MaxLength(MAX_LENGTH_50)
  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  readonly rate: string;

  @Fake(FAKE_CURRENCY_CODE)
  @Expose({ name: 'currencyCode' })
  @MaxLength(MAX_LENGTH_50)
  @IsString()
  @Type(() => String)
  readonly currencyCode: string;

  @Fake(FAKE_COMMON_VALUE)
  @Expose({ name: 'rateMinCharge' })
  @MaxLength(MAX_LENGTH_50)
  @IsString()
  @IsOptional()
  @Type(() => String)
  readonly rateMinCharge?: string;

  @DeepFakeMany(() => BPAttributesDto)
  @Expose({ name: 'subscriptionProductAttributeDetails' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BPAttributesDto)
  attributes: BPAttributesDto[];

  @Fake(FAKE_RATING_METHOD)
  @MaxLength(MAX_LENGTH_50)
  @Type(() => String)
  @IsString()
  @IsIn(RATING_METHODS)
  ratingMethod: string;
}

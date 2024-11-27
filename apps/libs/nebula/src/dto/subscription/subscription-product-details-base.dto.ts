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
  FAKE_PRODUCT_NAME,
  FAKE_RATING_METHOD,
  FAKE_UUID,
} from '@libs/nebula/testing/data/constants';
import Errors from '@libs/nebula/Error';
import {
  MAX_LENGTH_50,
  RATING_METHODS,
} from '@libs/nebula/subscription/subscription.constants';
import { IsV4UUID } from '@libs/nebula/utils/decorators/isV4UUID.decorator';

import { DTOFaker } from '../../testing/data/fakers/decorators/Faker';
import { Fake, DeepFakeMany } from '../../testing/data/fakers';
import { ExternalType } from '../../utils/external-type';

import { SubscriptionProductAttributeDetailsBaseDto } from './subscription-product-attribute-details-base.dto';

@ExternalType()
@DTOFaker()
export class SubscriptionProductDetailsBaseDto {
  @Fake(FAKE_OBJECT_ID)
  @Expose()
  @MaxLength(MAX_LENGTH_50)
  @IsNotEmpty({ context: Errors.InvalidPackageProductId.context })
  @Type(() => String)
  readonly packageProductId: string;

  @Fake(FAKE_OBJECT_ID)
  @Expose()
  @MaxLength(MAX_LENGTH_50)
  @IsNotEmpty({ context: Errors.InvalidProductId.context })
  @Type(() => String)
  readonly productId: string;

  @Fake(FAKE_ISO8601_DATE)
  @Expose()
  @IsNotEmpty()
  @IsISO8601()
  @Type(() => String)
  public readonly startDate: string;

  @Fake(FAKE_OBJECT_ID)
  @Expose()
  @MaxLength(MAX_LENGTH_50)
  @IsNotEmpty({ context: Errors.InvalidBillingAccountId.context })
  @Type(() => String)
  readonly billingAccountId: string;

  @Fake(FAKE_ISO8601_DATE)
  @Expose()
  @IsISO8601()
  @IsOptional()
  @Type(() => String)
  readonly renewalDate?: string;

  @Fake(FAKE_COMMON_VALUE)
  @Expose()
  @MaxLength(MAX_LENGTH_50)
  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  readonly quantity: string;

  @Fake(FAKE_PRICE)
  @Expose()
  @MaxLength(MAX_LENGTH_50)
  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  readonly rate: string;

  @Fake(FAKE_CURRENCY_CODE)
  @Expose()
  @MaxLength(MAX_LENGTH_50)
  @IsString()
  @Type(() => String)
  readonly currencyCode: string;

  @Fake(FAKE_COMMON_VALUE)
  @Expose()
  @MaxLength(MAX_LENGTH_50)
  @IsString()
  @IsOptional()
  @Type(() => String)
  readonly rateMinCharge?: string;

  @Fake(FAKE_PRODUCT_NAME)
  @MaxLength(MAX_LENGTH_50)
  @Expose()
  @IsString()
  @IsOptional()
  @Type(() => String)
  readonly productName: string;

  @Fake(FAKE_RATING_METHOD)
  @Expose()
  @MaxLength(MAX_LENGTH_50)
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  @IsIn(RATING_METHODS)
  readonly ratingMethod: string;

  @Fake(FAKE_UUID)
  @Expose()
  @Type(() => String)
  @IsV4UUID()
  @IsOptional()
  readonly addonProductOfferingId: string;

  @Fake(FAKE_UUID)
  @Expose()
  @Type(() => String)
  @IsV4UUID()
  @IsOptional()
  readonly addonServiceId: string;

  @DeepFakeMany(() => SubscriptionProductAttributeDetailsBaseDto)
  @Expose()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SubscriptionProductAttributeDetailsBaseDto)
  readonly subscriptionProductAttributeDetails: SubscriptionProductAttributeDetailsBaseDto[];
}

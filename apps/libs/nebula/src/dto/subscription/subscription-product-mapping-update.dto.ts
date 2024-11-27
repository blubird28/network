import { Expose, Type } from 'class-transformer';
import {
  IsIn,
  IsNotEmpty,
  IsOptional as IsOptionalValidator,
  IsString,
  NotEquals,
  ValidateIf,
  ValidationOptions,
} from 'class-validator';

import {
  FAKE_RATING_METHOD,
  FAKE_SUBSCRIPTION_PRODUCT_MAPPING_RESPONSE,
  FAKE_UUID,
} from '@libs/nebula/testing/data/constants';
import { Fake, DeepFakeMany } from '@libs/nebula/testing/data/fakers';
import Errors from '@libs/nebula/Error';
import { IsV4UUID } from '@libs/nebula/utils/decorators/isV4UUID.decorator';
import { RATING_METHODS } from '@libs/nebula/subscription/subscription.constants';

import { ExternalType } from '../../utils/external-type';
import { DTOFaker } from '../../testing/data/fakers/decorators/Faker';
import { SerializedDataDto } from '../serialized-data.dto';
import ArrayProp from '../decorators/ArrayProp.decorator';

import { SubscriptionAttributeEnricherConfigBaseDto } from './subscription-attribute-enricher-config-base.dto';

const IsOptional = (nullable = false, validationOptions?: ValidationOptions) =>
  nullable
    ? IsOptionalValidator(validationOptions)
    : ValidateIf((obj, value) => value !== undefined, validationOptions);

@ExternalType()
@DTOFaker()
export class SubscriptionProductMappingUpdateDto {
  @Fake(FAKE_UUID)
  @Expose()
  @IsNotEmpty({ context: Errors.InvalidProductOfferingId.context })
  @Type(() => String)
  @IsV4UUID()
  @NotEquals(null)
  @IsOptional()
  readonly ccProductOfferingId?: string;

  @Fake(FAKE_UUID)
  @Expose()
  @IsNotEmpty({ context: Errors.InvalidBaseProductOfferingId.context })
  @Type(() => String)
  @IsV4UUID()
  @NotEquals(null)
  @IsOptional()
  readonly ccBaseProductOfferingId?: string;

  @Fake(FAKE_UUID)
  @Expose()
  @IsNotEmpty()
  @Type(() => String)
  @IsV4UUID()
  @NotEquals(null)
  @IsOptional()
  readonly ccProductSpecificationId?: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @NotEquals(null)
  @IsOptional()
  @Fake(FAKE_SUBSCRIPTION_PRODUCT_MAPPING_RESPONSE.bpProductPackageId)
  readonly bpProductPackageId?: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @NotEquals(null)
  @IsOptional()
  @Fake(FAKE_SUBSCRIPTION_PRODUCT_MAPPING_RESPONSE.bpPackageId)
  readonly bpPackageId?: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @NotEquals(null)
  @IsOptional()
  @Fake(FAKE_SUBSCRIPTION_PRODUCT_MAPPING_RESPONSE.bpProductId)
  readonly bpProductId?: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @NotEquals(null)
  @IsOptional()
  @Fake(FAKE_RATING_METHOD)
  @IsIn(RATING_METHODS)
  readonly bpRatingMethod?: string;

  @Type(() => SerializedDataDto)
  @ArrayProp({ optional: true })
  @Fake([{ name: 'a_end_country', value: '<%= data.country %>' }])
  productAttributeTemplate?: Record<string, string | number | boolean>[];

  @DeepFakeMany(() => SubscriptionAttributeEnricherConfigBaseDto, {})
  @ArrayProp()
  @IsOptional()
  @Type(() => SubscriptionAttributeEnricherConfigBaseDto)
  enrichers?: SubscriptionAttributeEnricherConfigBaseDto[];
}

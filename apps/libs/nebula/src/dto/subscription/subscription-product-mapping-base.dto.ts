import { Type } from 'class-transformer';
import { IsOptional, IsIn, ValidateIf } from 'class-validator';

import {
  FAKE_RATING_METHOD,
  FAKE_SUBSCRIPTION_PRODUCT_MAPPING_RESPONSE,
} from '@libs/nebula/testing/data/constants';
import { DeepFakeMany, Fake } from '@libs/nebula/testing/data/fakers';
import { RATING_METHODS } from '@libs/nebula/subscription/subscription.constants';

import { DTOFaker } from '../../testing/data/fakers/decorators/Faker';
import { ExternalType } from '../../utils/external-type';
import StringProp, { UUIDv4Prop } from '../decorators/StringProp.decorator';
import { SerializedDataDto } from '../serialized-data.dto';
import ArrayProp from '../decorators/ArrayProp.decorator';

import { SubscriptionAttributeEnricherConfigBaseDto } from './subscription-attribute-enricher-config-base.dto';

@ExternalType()
@DTOFaker()
export class SubscriptionProductMappingBaseDto {
  @ValidateIf((o, value) => value !== undefined)
  @UUIDv4Prop()
  readonly ccBaseProductOfferingId?: string;

  @UUIDv4Prop({
    fake: FAKE_SUBSCRIPTION_PRODUCT_MAPPING_RESPONSE.ccProductOfferingId,
    allowEmpty: false,
  })
  readonly ccProductOfferingId: string;

  @UUIDv4Prop({
    fake: FAKE_SUBSCRIPTION_PRODUCT_MAPPING_RESPONSE.ccProductSpecificationId,
    allowEmpty: false,
  })
  readonly ccProductSpecificationId: string;

  @StringProp({
    allowEmpty: false,
    fake: FAKE_SUBSCRIPTION_PRODUCT_MAPPING_RESPONSE.bpProductPackageId,
  })
  readonly bpProductPackageId: string;

  @StringProp({
    allowEmpty: false,
    fake: FAKE_SUBSCRIPTION_PRODUCT_MAPPING_RESPONSE.bpPackageId,
  })
  readonly bpPackageId: string;

  @StringProp({
    allowEmpty: false,
    fake: FAKE_SUBSCRIPTION_PRODUCT_MAPPING_RESPONSE.bpProductId,
  })
  readonly bpProductId: string;

  @StringProp({
    allowEmpty: false,
    fake: FAKE_RATING_METHOD,
  })
  @IsIn(RATING_METHODS)
  readonly bpRatingMethod: string;

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

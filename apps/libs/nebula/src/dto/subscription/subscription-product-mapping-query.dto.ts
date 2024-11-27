import { ValidateIf } from 'class-validator';

import {
  FAKE_RATING_METHOD,
  FAKE_SUBSCRIPTION_PRODUCT_MAPPING_RESPONSE,
  FAKE_UUID,
} from '@libs/nebula/testing/data/constants';

import { DTOFaker } from '../../testing/data/fakers/decorators/Faker';
import { ExternalType } from '../../utils/external-type';
import StringProp, { UUIDv4Prop } from '../decorators/StringProp.decorator';

@ExternalType()
@DTOFaker()
export class SubscriptionProductMappingQueryDto {
  @UUIDv4Prop({
    fake: FAKE_UUID,
    allowEmpty: false,
  })
  @ValidateIf(
    (query) => !query.ccProductSpecificationId || query.ccProductOfferingId,
  )
  readonly ccProductOfferingId?: string;

  @UUIDv4Prop({
    fake: FAKE_UUID,
    allowEmpty: false,
  })
  @ValidateIf(
    (query) => !query.ccProductOfferingId || query.ccProductSpecificationId,
  )
  readonly ccProductSpecificationId?: string;

  @StringProp({
    allowEmpty: false,
    fake: FAKE_RATING_METHOD,
    optional: true,
  })
  readonly bpRatingMethod?: string;

  @UUIDv4Prop({
    allowEmpty: false,
    fake: FAKE_SUBSCRIPTION_PRODUCT_MAPPING_RESPONSE.orderId,
    optional: true,
  })
  readonly orderId?: string;
}

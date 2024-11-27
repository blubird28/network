import { FAKE_SUBSCRIPTION_PRODUCT_MAPPING_RESPONSE } from '@libs/nebula/testing/data/constants';

import { DTOFaker } from '../../testing/data/fakers/decorators/Faker';
import { ExternalType } from '../../utils/external-type';
import { UUIDv4Prop } from '../decorators/StringProp.decorator';

@ExternalType()
@DTOFaker()
export class SubscriptionProductMappingResponseDto {
  @UUIDv4Prop({
    fake: FAKE_SUBSCRIPTION_PRODUCT_MAPPING_RESPONSE.subscriptionProductMappingId,
    allowEmpty: false,
  })
  readonly subscriptionProductMappingId: string;

  constructor(subscriptionProductMappingId) {
    this.subscriptionProductMappingId = subscriptionProductMappingId;
  }
}

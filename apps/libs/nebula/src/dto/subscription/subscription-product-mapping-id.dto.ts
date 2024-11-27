import { FAKE_UUID } from '@libs/nebula/testing/data/constants';

import { UUIDv4Prop } from '../decorators/StringProp.decorator';
import { DTOFaker } from '../../testing/data/fakers/decorators/Faker';
import { ExternalType } from '../../utils/external-type';

@ExternalType()
@DTOFaker()
export class SubscriptionProductMappingIdDto {
  @UUIDv4Prop({
    fake: FAKE_UUID,
    allowEmpty: false,
  })
  readonly subscriptionProductMappingId: string;
}

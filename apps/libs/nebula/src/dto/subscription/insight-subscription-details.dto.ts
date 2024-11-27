import { FAKE_UUID } from '@libs/nebula/testing/data/constants';

import { DTOFaker } from '../../testing/data/fakers/decorators/Faker';
import { ExternalType } from '../../utils/external-type';
import { UUIDv4Prop } from '../decorators/StringProp.decorator';

import { InsightDetailsDto } from './insight-subscription-details.base.dto';

@ExternalType()
@DTOFaker()
export class SubscriptionInsightDetailDto extends InsightDetailsDto {
  @UUIDv4Prop({
    fake: FAKE_UUID,
    allowEmpty: false,
  })
  readonly id: string;
}

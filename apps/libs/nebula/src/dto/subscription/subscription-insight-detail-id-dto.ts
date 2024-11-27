import { ValidateIf } from 'class-validator';

import { FAKE_INSIGHT_REQUEST } from '@libs/nebula/testing/data/constants';

import { DTOFaker } from '../../testing/data/fakers/decorators/Faker';
import { ExternalType } from '../../utils/external-type';
import StringProp, { UUIDv4Prop } from '../decorators/StringProp.decorator';

@ExternalType()
@DTOFaker()
export class InsightSubscriptionDetailIdDto {
  @UUIDv4Prop({
    fake: FAKE_INSIGHT_REQUEST.orderId,
    optional: true,
  })
  @ValidateIf((query) => !query.salesRecordId || query.orderId)
  readonly orderId?: string;

  @StringProp({
    fake: FAKE_INSIGHT_REQUEST.salesRecordId,
    optional: true,
  })
  @ValidateIf((query) => !query.orderId || query.salesRecordId)
  readonly salesRecordId?: string;
}

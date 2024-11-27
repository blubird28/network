import { IsISO8601 } from 'class-validator';

import { FAKE_TERMINATE_SUBSCRIPTION_REQUEST } from '@libs/nebula/testing/data/constants';
import { MAX_LENGTH_120 } from '@libs/nebula/subscription/subscription.constants';

import { DTOFaker } from '../../testing/data/fakers/decorators/Faker';
import { ExternalType } from '../../utils/external-type';
import StringProp from '../decorators/StringProp.decorator';

@ExternalType()
@DTOFaker()
export class BPSubscriptionTerminationDto {
  @IsISO8601()
  @StringProp({
    allowEmpty: false,
    fake: FAKE_TERMINATE_SUBSCRIPTION_REQUEST.termination_date,
    optional: false,
  })
  readonly terminationDate: string;

  @StringProp({
    maxLength: MAX_LENGTH_120,
    allowEmpty: false,
    fake: FAKE_TERMINATE_SUBSCRIPTION_REQUEST.termination_reason,
    optional: true,
  })
  readonly terminationReason: string;
}

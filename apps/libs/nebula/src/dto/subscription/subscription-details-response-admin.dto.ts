import { IsISO8601 } from 'class-validator';

import {
  FAKE_OBJECT_ID,
  FAKE_PRICE,
  FAKE_SUBSCRIPTION_REQUEST,
  FAKE_SUBSCRIPTION_RESPONSE,
} from '@libs/nebula/testing/data/constants';
import { MAX_LENGTH_50 } from '@libs/nebula/subscription/subscription.constants';
import Errors from '@libs/nebula/Error';

import { DTOFaker } from '../../testing/data/fakers/decorators/Faker';
import { ExternalType } from '../../utils/external-type';
import StringProp from '../decorators/StringProp.decorator';

@ExternalType()
@DTOFaker()
export class SubscriptionDetailsResponseAdminDto {
  @StringProp({
    allowEmpty: false,
    fake: FAKE_OBJECT_ID,
    maxLength: MAX_LENGTH_50,
    error: Errors.InvalidBillingAccountId,
  })
  readonly billingAccountId: string;

  @StringProp({
    fake: FAKE_SUBSCRIPTION_RESPONSE.subscriptionId,
    maxLength: MAX_LENGTH_50,
    optional: true,
  })
  readonly bpSubscriptionId?: string;

  @IsISO8601()
  @StringProp({
    allowEmpty: false,
    fake: FAKE_SUBSCRIPTION_REQUEST.contract_start_date,
  })
  readonly contractStartDate: string;

  @IsISO8601()
  @StringProp({
    fake: FAKE_SUBSCRIPTION_REQUEST.contract_end_date,
    optional: true,
  })
  readonly contractEndDate?: string;

  @StringProp({
    allowEmpty: false,
    fake: FAKE_PRICE,
  })
  readonly billingAmount: string;
}

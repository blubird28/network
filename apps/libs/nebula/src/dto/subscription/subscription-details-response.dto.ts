import { IsISO8601 } from 'class-validator';

import {
  FAKE_PRICE,
  FAKE_SUBSCRIPTION_REQUEST,
} from '@libs/nebula/testing/data/constants';

import { DTOFaker } from '../../testing/data/fakers/decorators/Faker';
import { ExternalType } from '../../utils/external-type';
import StringProp from '../decorators/StringProp.decorator';

@ExternalType()
@DTOFaker()
export class SubscriptionDetailsResponseDto {
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

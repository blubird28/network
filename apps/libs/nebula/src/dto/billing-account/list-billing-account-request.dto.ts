import { IsIn } from 'class-validator';

import {
  FAKE_BILLING_REQUEST,
  FAKE_DEEP_SEARCH_MANUAL_SYNC_FLAG,
} from '@libs/nebula/testing/data/constants';
import { DTOFaker } from '@libs/nebula/testing/data/fakers/decorators/Faker';
import { MAX_LENGTH_50 } from '@libs/nebula/subscription/subscription.constants';
import { SORT_OPTIONS } from '@libs/nebula/billing-account/billing-account.constants';

import StringProp from '../decorators/StringProp.decorator';

@DTOFaker()
export class ListBillingAccountRequestDto {
  @StringProp({
    fake: FAKE_BILLING_REQUEST.crm_customer_id,
    maxLength: MAX_LENGTH_50,
    allowEmpty: false,
  })
  readonly crmCustomerId: string;

  @StringProp({
    fake: FAKE_BILLING_REQUEST.name,
    maxLength: MAX_LENGTH_50,
    optional: true,
    allowEmpty: false,
  })
  readonly name?: string;

  @StringProp({
    fake: 'ASC',
    optional: true,
    allowEmpty: false,
  })
  @IsIn(SORT_OPTIONS) // Sorting order (ASC or DESC)
  readonly sort?: string;

  @StringProp({
    fake: FAKE_DEEP_SEARCH_MANUAL_SYNC_FLAG,
    maxLength: MAX_LENGTH_50,
    optional: true,
    allowEmpty: false,
  })
  readonly manualSync?: boolean;
}

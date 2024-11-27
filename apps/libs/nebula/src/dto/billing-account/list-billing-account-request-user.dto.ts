import { IsIn } from 'class-validator';

import { FAKE_BILLING_REQUEST } from '@libs/nebula/testing/data/constants';
import { DTOFaker } from '@libs/nebula/testing/data/fakers/decorators/Faker';
import { MAX_LENGTH_50 } from '@libs/nebula/subscription/subscription.constants';
import { SORT_OPTIONS } from '@libs/nebula/billing-account/billing-account.constants';

import StringProp from '../decorators/StringProp.decorator';

@DTOFaker()
export class ListBillingAccountRequestUserDto {
  @StringProp({
    fake: FAKE_BILLING_REQUEST.crm_customer_id,
    maxLength: MAX_LENGTH_50,
    allowEmpty: false,
  })
  readonly companyId: string;

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
}

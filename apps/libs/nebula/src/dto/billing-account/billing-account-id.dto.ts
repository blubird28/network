import { FAKE_BILLING_REQUEST } from '@libs/nebula/testing/data/constants';
import {
  BILLING_ACCOUNT_ID_MIN_LENGTH,
  BILLING_ACCOUNT_ID_MAX_LENGTH,
} from '@libs/nebula/billing-account/billing-account.constants';

import Errors from '../../Error';
import { DTOFaker } from '../../testing/data/fakers/decorators/Faker';
import StringProp from '../decorators/StringProp.decorator';

@DTOFaker()
export class BillingAccountIdDto {
  @StringProp({
    allowEmpty: false,
    minLength: BILLING_ACCOUNT_ID_MIN_LENGTH,
    maxLength: BILLING_ACCOUNT_ID_MAX_LENGTH,
    error: Errors.InvalidBillingAccountId,
    fake: FAKE_BILLING_REQUEST.bp_account_id,
  })
  readonly id: string;
}

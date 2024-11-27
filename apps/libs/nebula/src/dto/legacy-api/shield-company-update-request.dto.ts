import Errors from '@libs/nebula/Error';

import StringProp from '../decorators/StringProp.decorator';
import {
  FAKE_BILLING_REQUEST,
  FAKE_COMPANY_DETAILS,
} from '../../testing/data/constants';
import { ExternalType } from '../../utils/external-type';
import { DTOFaker } from '../../testing/data/fakers/decorators/Faker';
import NumberProp from '../decorators/NumberProp.decorator';
import BooleanProp from '../decorators/BooleanProp.decorator';

@ExternalType()
@DTOFaker()
export class ShieldCompanyUpdateRequestDto {
  @StringProp({
    allowEmpty: false,
    fake: FAKE_BILLING_REQUEST.bp_account_id,
    error: Errors.InvalidBillingAccountId,
  })
  readonly billingAccount: string;

  @NumberProp({
    fake: FAKE_COMPANY_DETAILS.insight_signed_company_id,
  })
  readonly signedCompanyRefId: number;

  @BooleanProp({
    fake: true,
  })
  readonly signedCompanyVerified: boolean;
}

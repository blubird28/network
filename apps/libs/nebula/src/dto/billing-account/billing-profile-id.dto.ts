import { FAKE_BP_BILLING_WALLET_PROFILE_ID } from '@libs/nebula/testing/data/constants';

import { DTOFaker } from '../../testing/data/fakers/decorators/Faker';
import { UUIDProp } from '../decorators/StringProp.decorator';

@DTOFaker()
export class BillingProfileIdDto {
  @UUIDProp({
    allowEmpty: false,
    fake: FAKE_BP_BILLING_WALLET_PROFILE_ID,
  })
  readonly billingProfileId: string;
}

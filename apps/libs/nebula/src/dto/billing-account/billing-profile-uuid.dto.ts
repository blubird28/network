import { FAKE_BILLING_REQUEST } from '@libs/nebula/testing/data/constants';

import { DTOFaker } from '../../testing/data/fakers/decorators/Faker';
import { UUIDProp } from '../decorators/StringProp.decorator';

@DTOFaker()
export class BillingProfileUuidDto {
  @UUIDProp({
    allowEmpty: false,
    fake: FAKE_BILLING_REQUEST.bp_billing_profile_uuid,
  })
  readonly billingProfileUuid: string;
}

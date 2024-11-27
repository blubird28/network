import {
  FAKE_BILLING_REQUEST,
  CRM_INSIGHT,
} from '@libs/nebula/testing/data/constants';
import { DTOFaker } from '@libs/nebula/testing/data/fakers/decorators/Faker';

import StringProp from '../decorators/StringProp.decorator';

@DTOFaker()
export class ShieldCompanyExternalDetails {
  @StringProp({
    allowEmpty: false,
    fake: FAKE_BILLING_REQUEST.crm_customer_id,
  })
  readonly id: string;

  @StringProp({
    allowEmpty: false,
    fake: CRM_INSIGHT,
  })
  readonly type: string;
}

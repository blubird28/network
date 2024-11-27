import { FAKE_COMPANY_DETAILS } from '@libs/nebula/testing/data/constants';
import { Fake } from '@libs/nebula/testing/data/fakers';
import { DTOFaker } from '@libs/nebula/testing/data/fakers/decorators/Faker';
import {
  MAX_LENGTH_10,
  MAX_LENGTH_120,
  MAX_LENGTH_50,
} from '@libs/nebula/subscription/subscription.constants';

import StringProp from '../decorators/StringProp.decorator';
import NumberProp from '../decorators/NumberProp.decorator';
import BooleanProp from '../decorators/BooleanProp.decorator';

@DTOFaker()
export class CompanyDetails {
  @Fake(FAKE_COMPANY_DETAILS.id)
  readonly id: string;

  @StringProp({
    fake: FAKE_COMPANY_DETAILS.billing_entity,
    maxLength: MAX_LENGTH_120,
    allowEmpty: false,
  })
  readonly billingEntity: string;

  @NumberProp({
    fake: FAKE_COMPANY_DETAILS.insight_signed_company_id,
  })
  readonly insightSignedCompanyId: number;

  @StringProp({
    fake: FAKE_COMPANY_DETAILS.branch,
    maxLength: MAX_LENGTH_50,
    allowEmpty: false,
  })
  readonly branch: string;

  @StringProp({
    fake: FAKE_COMPANY_DETAILS.pccw_epi_comp_id,
    maxLength: MAX_LENGTH_10,
    allowEmpty: false,
  })
  readonly pccwEpiCompId: string;

  @StringProp({
    fake: FAKE_COMPANY_DETAILS.region,
    maxLength: MAX_LENGTH_50,
    allowEmpty: false,
  })
  readonly region: string;

  @BooleanProp({ fake: true })
  readonly eligibleForOnline: boolean;

  @BooleanProp({ fake: true })
  readonly defaultBillingEntity: boolean;

  @BooleanProp({ fake: true })
  readonly defaultBillingRegion: boolean;
}

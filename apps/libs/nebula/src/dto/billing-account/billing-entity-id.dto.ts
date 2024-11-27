import { FAKE_COMPANY_DETAILS } from '@libs/nebula/testing/data/constants';
import { MAX_LENGTH_10 } from '@libs/nebula/subscription/subscription.constants';

import StringProp from '../decorators/StringProp.decorator';
import { DTOFaker } from '../../testing/data/fakers/decorators/Faker';

@DTOFaker()
export class BillingEntityIdDto {
  @StringProp({
    fake: FAKE_COMPANY_DETAILS.pccw_epi_comp_id,
    maxLength: MAX_LENGTH_10,
    allowEmpty: false,
  })
  readonly pccwEpiCompId: string;
}

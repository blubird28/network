import { FAKE_COMPANY_DETAILS } from '@libs/nebula/testing/data/constants';

import { DTOFaker } from '../../testing/data/fakers/decorators/Faker';
import { ExternalType } from '../../utils/external-type';
import StringProp from '../decorators/StringProp.decorator';

@ExternalType()
@DTOFaker()
export class BillingEntityResponseDto {
  @StringProp({
    fake: FAKE_COMPANY_DETAILS.id,
    allowEmpty: false,
  })
  readonly id: string;

  constructor(id) {
    this.id = id;
  }
}

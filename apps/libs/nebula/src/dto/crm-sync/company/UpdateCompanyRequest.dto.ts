import BooleanProp from '@libs/nebula/dto/decorators/BooleanProp.decorator';

import StringProp from '../../decorators/StringProp.decorator';
import { FAKE_CRM_ID } from '../../../testing/data/constants';
import { DTOFaker } from '../../../testing/data/fakers/decorators/Faker';
import { ExternalType } from '../../../utils/external-type';

import { CreateCompanyRequestDto } from './CreateCompanyRequest.dto';
import { CRMCompany } from './crm-company.interface';

@DTOFaker()
@ExternalType()
export class UpdateCompanyRequestDto extends CreateCompanyRequestDto {
  @StringProp({ fake: FAKE_CRM_ID })
  id: string;

  @BooleanProp({ fake: false, optional: true })
  invoice_payment_enabled?: boolean;

  constructor(
    state?: CRMCompany,
    consoleId?: string,
    crmId?: string,
    applicationSource?: string,
  ) {
    super(state, consoleId, applicationSource);
    if (crmId) {
      this.id = crmId;
    }
    if (state) {
      this.invoice_payment_enabled = state?.invoiceEnabled;
    }
  }
}

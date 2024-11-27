import BooleanProp from '@libs/nebula/dto/decorators/BooleanProp.decorator';

import StringProp from '../../decorators/StringProp.decorator';
import { ACME_INSIGHT_ID, FAKE_CRM_ID } from '../../../testing/data/constants';
import { DTOFaker } from '../../../testing/data/fakers/decorators/Faker';
import { ExternalType } from '../../../utils/external-type';

import { CRMCompany } from './crm-company.interface';
import { CRMCompanyRequestBaseDto } from './CRMCompanyRequestBase.dto';

@DTOFaker()
@ExternalType()
export class CompanyResponseDto extends CRMCompanyRequestBaseDto {
  @StringProp({ fake: FAKE_CRM_ID })
  id: string;

  @StringProp({ fake: ACME_INSIGHT_ID, optional: true })
  customer_code: string;

  @BooleanProp({ fake: false, optional: true })
  invoice_payment_enabled?: boolean;

  toCRMCompany(): CRMCompany {
    return {
      name: this.name,
      domain: this.domain,
      businessRegistrationNumber: this.business_registration_number,
      address: this.address,
      city: this.city,
      state: this.state,
      country: this.country_code_alpha_2,
      zip: this.postal_code,
      website: this.website,
      description: this.description,
      phone: this.phone,
      businessType: this.business_type,
      insightId: this.customer_code,
      invoiceEnabled: this.invoice_payment_enabled ?? undefined,
      createdAt: this.cc_company_create_date,
    };
  }
}

import { DTOFaker } from '../../../testing/data/fakers/decorators/Faker';
import { ExternalType } from '../../../utils/external-type';

import { CRMCompany } from './crm-company.interface';
import { CRMCompanyRequestBaseDto } from './CRMCompanyRequestBase.dto';

@DTOFaker()
@ExternalType()
export class CreateCompanyRequestDto extends CRMCompanyRequestBaseDto {
  constructor(
    state?: CRMCompany,
    consoleId?: string,
    applicationSource?: string,
  ) {
    super();
    if (state) {
      this.name = state.name;
      this.phone = state.phone;
      this.address = state.address;
      this.city = state.city;
      this.state = state.state;
      this.postal_code = state.zip;
      this.country_code_alpha_2 = state.country;
      this.website = state.website;
      this.domain = state.domain;
      this.description = state.description;
      this.business_type = state.businessType;
      this.business_registration_number = state.businessRegistrationNumber;
      this.cc_company_create_date = state.createdAt;
    }
    if (consoleId) {
      this.cc_company_uuid = consoleId;
    }
    if (applicationSource) {
      this.application_source = applicationSource;
    }
  }
}

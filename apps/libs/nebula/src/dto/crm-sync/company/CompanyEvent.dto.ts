import { CRMCompanyBaseDto } from '@libs/nebula/dto/crm-sync/company/CRMCompanyBase.dto';
import BooleanProp from '@libs/nebula/dto/decorators/BooleanProp.decorator';

import StringProp from '../../decorators/StringProp.decorator';
import {
  ACME_INSIGHT_ID,
  FAKE_CRM_COMPANY,
  FAKE_CRM_ID,
} from '../../../testing/data/constants';
import { DTOFaker } from '../../../testing/data/fakers/decorators/Faker';
import { ExternalType } from '../../../utils/external-type';

import { CRMCompany } from './crm-company.interface';

export const VERIFIED_SUCCESS = 'success';

@DTOFaker()
@ExternalType()
export class CompanyEventDto extends CRMCompanyBaseDto {
  @StringProp({ fake: FAKE_CRM_ID })
  id: string;

  @StringProp({ fake: 'success', optional: true })
  customer_verify_result?: string;

  @StringProp({ fake: ACME_INSIGHT_ID, optional: true })
  customer_code: string;

  @StringProp({ fake: FAKE_CRM_COMPANY.accountManagerEmail })
  company_owner: string;

  @StringProp({ optional: true, fake: FAKE_CRM_COMPANY.businessPricingSegment })
  pricing_segment?: string;

  @BooleanProp({ optional: true, fake: FAKE_CRM_COMPANY.crmInternalFlag })
  internal_demo_company?: boolean;

  isVerified(): boolean {
    return this.customer_verify_result === VERIFIED_SUCCESS;
  }

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
      verified: this.isVerified(),
      insightId: this.customer_code,
      accountManagerEmail: this.company_owner,
      businessPricingSegment: this.pricing_segment,
      crmInternalFlag: this.internal_demo_company,
    };
  }
}

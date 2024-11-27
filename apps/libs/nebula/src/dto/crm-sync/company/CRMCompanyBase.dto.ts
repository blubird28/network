import { IsISO8601 } from 'class-validator';

import { DTOFaker } from '@libs/nebula/testing/data/fakers/decorators/Faker';
import { ExternalType } from '@libs/nebula/utils/external-type';

import StringProp from '../../decorators/StringProp.decorator';
import {
  FAKE_CRM_COMPANY,
  FAKE_OBJECT_ID,
  FIRST_JAN_2020_STRING,
} from '../../../testing/data/constants';

@DTOFaker()
@ExternalType()
export class CRMCompanyBaseDto {
  @StringProp({ fake: FAKE_CRM_COMPANY.name })
  name: string;

  @StringProp({ fake: FAKE_CRM_COMPANY.address, optional: true })
  address?: string;

  @StringProp({ fake: FAKE_CRM_COMPANY.city, optional: true })
  city?: string;

  @StringProp({ fake: FAKE_CRM_COMPANY.state, optional: true })
  state?: string;

  @StringProp({ fake: FAKE_CRM_COMPANY.country })
  country_code_alpha_2: string;

  @StringProp({ fake: FAKE_CRM_COMPANY.zip, optional: true })
  postal_code?: string;

  @StringProp({ fake: FAKE_CRM_COMPANY.domain })
  domain: string;

  @StringProp({ fake: FAKE_OBJECT_ID, optional: true })
  cc_company_uuid: string;

  @StringProp({ fake: FAKE_CRM_COMPANY.businessRegistrationNumber })
  business_registration_number: string;

  @IsISO8601()
  @StringProp({ optional: true, fake: FIRST_JAN_2020_STRING })
  cc_company_create_date?: string;
}

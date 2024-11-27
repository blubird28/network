import { ValidBusinessType } from '@libs/nebula/dto/crm-sync/utils';

import { DTOFaker } from '../../../testing/data/fakers/decorators/Faker';
import { ExternalType } from '../../../utils/external-type';
import StringProp from '../../decorators/StringProp.decorator';
import {
  FAKE_APPLICATION_SOURCE,
  FAKE_CRM_COMPANY,
} from '../../../testing/data/constants';

import { CRMCompanyBaseDto } from './CRMCompanyBase.dto';

@DTOFaker()
@ExternalType()
export class CRMCompanyRequestBaseDto extends CRMCompanyBaseDto {
  @StringProp({ fake: FAKE_CRM_COMPANY.phone, optional: true })
  phone?: string;

  @StringProp({ fake: FAKE_CRM_COMPANY.website, optional: true })
  website?: string;

  @StringProp({ fake: '500', optional: true })
  number_of_employees?: string;

  @StringProp({ fake: 'Telecommunication', optional: true })
  industry?: string;

  @StringProp({ fake: FAKE_CRM_COMPANY.description, optional: true })
  description?: string;

  @StringProp({ fake: FAKE_CRM_COMPANY.businessType, optional: true })
  business_type?: ValidBusinessType;

  @StringProp({ fake: FAKE_APPLICATION_SOURCE, optional: true })
  application_source?: string;
}

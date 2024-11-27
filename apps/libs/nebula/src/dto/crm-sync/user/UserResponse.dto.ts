import StringProp from '@libs/nebula/dto/decorators/StringProp.decorator';
import { FAKE_CRM_ID } from '@libs/nebula/testing/data/constants';

import { DTOFaker } from '../../../testing/data/fakers/decorators/Faker';
import { ExternalType } from '../../../utils/external-type';

import { CRMUser } from './crm-user.interface';
import { CRMUserBaseDto } from './CRMUserBase.dto';

@DTOFaker()
@ExternalType()
export class UserResponseDto extends CRMUserBaseDto {
  @StringProp({ fake: FAKE_CRM_ID })
  id: string;

  toCRMUser(): CRMUser {
    return {
      email: this.email,
      firstName: this.first_name,
      jobTitle: this.job_title,
      lastName: this.last_name,
      phone: this.phone,
      subscribeToMarketingUpdates: this.subscribe_to_marketing_updates,
    };
  }
}

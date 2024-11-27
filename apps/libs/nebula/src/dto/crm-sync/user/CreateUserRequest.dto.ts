import { FAKE_APPLICATION_SOURCE } from '@libs/nebula/testing/data/constants';

import { DTOFaker } from '../../../testing/data/fakers/decorators/Faker';
import { ExternalType } from '../../../utils/external-type';
import StringProp from '../../decorators/StringProp.decorator';

import { CRMUser } from './crm-user.interface';
import { CRMUserBaseDto } from './CRMUserBase.dto';

@DTOFaker()
@ExternalType()
export class CreateUserRequestDto extends CRMUserBaseDto {
  @StringProp({ fake: FAKE_APPLICATION_SOURCE, optional: true })
  application_source?: string;

  constructor(state?: CRMUser, consoleId?: string, applicationSource?: string) {
    super();
    if (state) {
      this.email = state.email;
      this.first_name = state.firstName;
      this.job_title = state.jobTitle;
      this.last_name = state.lastName;
      this.phone = state.phone;
      this.subscribe_to_marketing_updates = state.subscribeToMarketingUpdates;
    }
    if (consoleId) {
      this.cc_user_uuid = consoleId;
    }
    if (applicationSource) {
      this.application_source = applicationSource;
    }
  }
}

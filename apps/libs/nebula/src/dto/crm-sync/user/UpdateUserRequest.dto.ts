import StringProp from '../../decorators/StringProp.decorator';
import { FAKE_CRM_ID } from '../../../testing/data/constants';
import { DTOFaker } from '../../../testing/data/fakers/decorators/Faker';
import { ExternalType } from '../../../utils/external-type';

import { CRMUser } from './crm-user.interface';
import { CreateUserRequestDto } from './CreateUserRequest.dto';

@DTOFaker()
@ExternalType()
export class UpdateUserRequestDto extends CreateUserRequestDto {
  @StringProp({ fake: FAKE_CRM_ID })
  id: string;
  constructor(state?: CRMUser, consoleId?: string, crmId?: string) {
    super(state, consoleId);
    if (crmId) {
      this.id = crmId;
    }
  }
}

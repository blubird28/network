import { FAKE_CRM_USER, FAKE_OBJECT_ID } from '../../../testing/data/constants';
import BooleanProp from '../../decorators/BooleanProp.decorator';
import StringProp from '../../decorators/StringProp.decorator';

export class CRMUserBaseDto {
  @StringProp({ fake: FAKE_OBJECT_ID, optional: true })
  cc_user_uuid: string;

  @StringProp({ fake: FAKE_CRM_USER.email })
  email: string;

  @StringProp({ fake: FAKE_CRM_USER.firstName })
  first_name: string;

  @StringProp({ fake: FAKE_CRM_USER.jobTitle, optional: true })
  job_title?: string;

  @StringProp({ fake: FAKE_CRM_USER.lastName })
  last_name: string;

  @StringProp({ fake: FAKE_CRM_USER.phone, optional: true })
  phone?: string;

  @BooleanProp({
    fake: FAKE_CRM_USER.subscribeToMarketingUpdates,
    optional: true,
  })
  subscribe_to_marketing_updates?: boolean;
}

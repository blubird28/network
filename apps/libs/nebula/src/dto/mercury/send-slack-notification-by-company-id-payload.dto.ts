import { DTOFaker } from '../../testing/data/fakers/decorators/Faker';
import { ExternalType } from '../../utils/external-type';
import { MongoIDProp } from '../decorators/StringProp.decorator';

import { SendSlackNotificationBase } from './send-slack-notification-base.dto';

@ExternalType()
@DTOFaker()
export class SendSlackNotificationByCompanyIdPayloadDto extends SendSlackNotificationBase {
  /**
   * The Company ID (a mongo object ID) the slack notification relates to
   */
  @MongoIDProp()
  companyId: string;
}

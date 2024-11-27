import StringProp from '../decorators/StringProp.decorator';
import { DTOFaker } from '../../testing/data/fakers/decorators/Faker';
import { ExternalType } from '../../utils/external-type';

import { SendSlackNotificationBase } from './send-slack-notification-base.dto';

@ExternalType()
@DTOFaker()
export class SendSlackNotificationByHookNamePayloadDto extends SendSlackNotificationBase {
  @StringProp({ allowEmpty: false, fake: 'DEMO' })
  hookName: string;
}

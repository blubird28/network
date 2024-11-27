import { Validate } from 'class-validator';
import { Expose, Type } from 'class-transformer';

import BooleanProp from '@libs/nebula/dto/decorators/BooleanProp.decorator';
import StringProp from '@libs/nebula/dto/decorators/StringProp.decorator';

import { ExternalType } from '../../utils/external-type';
import { DTOFaker } from '../../testing/data/fakers/decorators/Faker';
import { Fake } from '../../testing/data/fakers';
import Errors from '../../Error';
import { SerializedData } from '../../Serialization/serializes';
import { SerializedDataDto, ValidSerializedData } from '../serialized-data.dto';

import { NotificationTriggerIdDto } from './notification-trigger-id.dto';

@ExternalType()
@DTOFaker()
export class CreateNotificationDto extends NotificationTriggerIdDto {
  /**
   * The name of this notification.
   * @example Send Order Created Slack message to support
   */
  @StringProp({
    fake: 'Send Order Created Slack message to support',
    allowEmpty: false,
  })
  readonly name: string;

  /**
   * The handler for this notification. The handler must be defined in the notification service.
   * @example SLACK_SEND_TO_DEFAULT
   */
  @StringProp({ fake: 'SLACK_SEND_TO_DEFAULT', allowEmpty: false })
  readonly handler: string;

  /**
   * A template which will be resolved and passed as arguments to the handler.
   * A valid template is:
   *  - Any of the basic types: string, number, boolean, null, or
   *  - An object with string keys and values that are valid templates, or
   *  - An array of valid templates
   *  Strings within the template will be resolved as template strings, which can contain logic in ruby template-style tags
   *  The payload of the triggering event, as well as any enriched keys, will be included as context which can be accessed within templates
   * @example {"attachments": [{"text": "An order has been placed by <%= srcCompany.name %>"}]}
   */
  @Expose()
  @Type(() => SerializedDataDto)
  @Fake([
    {
      attachments: [
        { text: 'An order has been placed by <%= srcCompany.name %>' },
      ],
    },
  ])
  @Validate(ValidSerializedData, { context: Errors.InvalidTemplate.context })
  template: SerializedData;

  /**
   * If true, this notification will not run its handler when triggered. It's parameters will be resolved and logged.
   * If false, this notification will run.
   */
  @BooleanProp({ optional: true, fake: false })
  dryRun: boolean;
}

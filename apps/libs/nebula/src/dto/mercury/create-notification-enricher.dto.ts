import { Validate } from 'class-validator';
import { Expose, Type } from 'class-transformer';

import BooleanProp from '@libs/nebula/dto/decorators/BooleanProp.decorator';
import StringProp from '@libs/nebula/dto/decorators/StringProp.decorator';

import { ExternalType } from '../../utils/external-type';
import { DTOFaker } from '../../testing/data/fakers/decorators/Faker';
import { Fake } from '../../testing/data/fakers';
import { SerializedDataDto, ValidSerializedData } from '../serialized-data.dto';
import { SerializedData } from '../../Serialization/serializes';
import Errors from '../../Error';

import { NotificationTriggerIdDto } from './notification-trigger-id.dto';

@ExternalType()
@DTOFaker()
export class CreateNotificationEnricherDto extends NotificationTriggerIdDto {
  /**
   * The property which this enricher will create. Should be unique per notification.
   * @example srcCompany
   */
  @StringProp({ fake: 'srcCompany', allowEmpty: false })
  readonly key: string;

  /**
   * The handler for this enricher. The handler must be defined in the notification service.
   * @example GET_COMPANY
   */
  @StringProp({ fake: 'GET_COMPANY', allowEmpty: false })
  readonly handler: string;

  /**
   * A template which will be resolved and passed as arguments to the handler.
   * @example <%= eventPayload.srcCompanyId %>
   */
  @Expose()
  @Type(() => SerializedDataDto)
  @Fake(['<%= eventPayload.srcCompanyId %>'])
  @Validate(ValidSerializedData, { context: Errors.InvalidTemplate.context })
  paramTemplate: SerializedData;

  /**
   * If true, this enricher will not run its handler when triggered. It's parameters will be resolved and logged.
   * If false, this enricher will run and add its result to the payload.
   */
  @BooleanProp({ optional: true, fake: false })
  dryRun: boolean;
}

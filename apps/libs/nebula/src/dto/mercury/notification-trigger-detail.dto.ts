import { Type } from 'class-transformer';

import { ExternalType } from '../../utils/external-type';
import { DTOFaker } from '../../testing/data/fakers/decorators/Faker';
import { DeepFakeMany } from '../../testing/data/fakers';
import ArrayProp from '../decorators/ArrayProp.decorator';

import { NotificationEnricherDto } from './notification-enricher.dto';
import { NotificationTriggerDto } from './notification-trigger.dto';
import { NotificationDto } from './notification.dto';

@ExternalType()
@DTOFaker()
export class NotificationTriggerDetailDto extends NotificationTriggerDto {
  /**
   * The enrichers attached to this trigger
   */
  @DeepFakeMany(() => NotificationEnricherDto)
  @Type(() => NotificationEnricherDto)
  @ArrayProp()
  enrichers: NotificationEnricherDto[];
  /**
   * The enrichers attached to this trigger
   */
  @DeepFakeMany(() => NotificationDto)
  @Type(() => NotificationDto)
  @ArrayProp()
  notifications: NotificationDto[];
}

import { Expose, Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

import { ExternalType } from '@libs/nebula/utils/external-type';
import { DTOFaker } from '@libs/nebula/testing/data/fakers/decorators/Faker';
import { IsV4UUID } from '@libs/nebula/utils/decorators/isV4UUID.decorator';
import { FakeUuid } from '@libs/nebula/testing/data/fakers';
import { CreateNotificationTriggerDto } from '@libs/nebula/dto/mercury/create-notification-trigger.dto';

@ExternalType()
@DTOFaker()
export class NotificationTriggerDto extends CreateNotificationTriggerDto {
  /**
   * The ID (v4 UUID) of the notification trigger
   */
  @FakeUuid
  @IsNotEmpty()
  @IsV4UUID()
  @Type(() => String)
  @Expose()
  readonly id: string;
}

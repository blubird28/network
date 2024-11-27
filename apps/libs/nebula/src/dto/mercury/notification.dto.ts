import { Expose, Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

import { ExternalType } from '@libs/nebula/utils/external-type';
import { DTOFaker } from '@libs/nebula/testing/data/fakers/decorators/Faker';
import { CreateNotificationDto } from '@libs/nebula/dto/mercury/create-notification.dto';
import { IsV4UUID } from '@libs/nebula/utils/decorators/isV4UUID.decorator';
import { FakeUuid } from '@libs/nebula/testing/data/fakers';

@ExternalType()
@DTOFaker()
export class NotificationDto extends CreateNotificationDto {
  /**
   * The ID (v4 UUID) of the notification
   */
  @FakeUuid
  @IsNotEmpty()
  @IsV4UUID()
  @Type(() => String)
  @Expose()
  readonly id: string;
}

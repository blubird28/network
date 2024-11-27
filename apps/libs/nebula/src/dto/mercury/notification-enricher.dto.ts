import { Expose, Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

import { ExternalType } from '@libs/nebula/utils/external-type';
import { DTOFaker } from '@libs/nebula/testing/data/fakers/decorators/Faker';
import { IsV4UUID } from '@libs/nebula/utils/decorators/isV4UUID.decorator';
import { FakeUuid } from '@libs/nebula/testing/data/fakers';
import { CreateNotificationEnricherDto } from '@libs/nebula/dto/mercury/create-notification-enricher.dto';

@ExternalType()
@DTOFaker()
export class NotificationEnricherDto extends CreateNotificationEnricherDto {
  /**
   * The ID (v4 UUID) of the notification enricher
   */
  @FakeUuid
  @IsNotEmpty()
  @IsV4UUID()
  @Type(() => String)
  @Expose()
  readonly id: string;
}

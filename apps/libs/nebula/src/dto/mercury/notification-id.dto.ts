import { IsNotEmpty } from 'class-validator';
import { Expose, Type } from 'class-transformer';

import { ExternalType } from '@libs/nebula/utils/external-type';
import { DTOFaker } from '@libs/nebula/testing/data/fakers/decorators/Faker';
import { FakeUuid } from '@libs/nebula/testing/data/fakers';
import { IsV4UUID } from '@libs/nebula/utils/decorators/isV4UUID.decorator';

@ExternalType()
@DTOFaker()
export class NotificationIdDto {
  /**
   * The ID (v4 UUID) of a notification
   */
  @FakeUuid
  @IsNotEmpty()
  @IsV4UUID()
  @Type(() => String)
  @Expose()
  readonly notificationId: string;
}

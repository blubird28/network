import { PartialType } from '@nestjs/swagger';

import { ExternalType } from '@libs/nebula/utils/external-type';
import { DTOFaker } from '@libs/nebula/testing/data/fakers/decorators/Faker';
import { IntersectionFaker } from '@libs/nebula/testing/data/fakers';
import { CreateNotificationTriggerDto } from '@libs/nebula/dto/mercury/create-notification-trigger.dto';

@ExternalType()
@DTOFaker()
@IntersectionFaker(CreateNotificationTriggerDto)
export class UpdateNotificationTriggerDto extends PartialType(
  CreateNotificationTriggerDto,
) {}

import { PartialType } from '@nestjs/swagger';

import { ExternalType } from '@libs/nebula/utils/external-type';
import { DTOFaker } from '@libs/nebula/testing/data/fakers/decorators/Faker';
import { IntersectionFaker } from '@libs/nebula/testing/data/fakers';
import { CreateNotificationEnricherDto } from '@libs/nebula/dto/mercury/create-notification-enricher.dto';

@ExternalType()
@DTOFaker()
@IntersectionFaker(CreateNotificationEnricherDto)
export class UpdateNotificationEnricherDto extends PartialType(
  CreateNotificationEnricherDto,
) {}

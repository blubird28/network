import { PartialType } from '@nestjs/swagger';

import { ExternalType } from '@libs/nebula/utils/external-type';
import { DTOFaker } from '@libs/nebula/testing/data/fakers/decorators/Faker';
import { CreateNotificationDto } from '@libs/nebula/dto/mercury/create-notification.dto';
import { IntersectionFaker } from '@libs/nebula/testing/data/fakers';

@ExternalType()
@DTOFaker()
@IntersectionFaker(CreateNotificationDto)
export class UpdateNotificationDto extends PartialType(CreateNotificationDto) {}

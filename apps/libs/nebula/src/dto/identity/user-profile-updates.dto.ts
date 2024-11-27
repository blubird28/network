import { PartialType } from '@nestjs/swagger';

import { ExternalType } from '../../utils/external-type';
import { IntersectionFaker } from '../../testing/data/fakers';
import { ReferencedEmpty } from '../../ReferenceBuilder/decorators';

import { UserProfileDto } from './user-profile.dto';

@ExternalType<Partial<UserProfileDto>>()
@ReferencedEmpty()
@IntersectionFaker(UserProfileDto)
export class UserProfileUpdatesDto extends PartialType(UserProfileDto) {}

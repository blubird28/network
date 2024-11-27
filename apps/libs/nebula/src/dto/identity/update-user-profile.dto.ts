import { IntersectionType } from '@nestjs/swagger';

import { ExternalType } from '../../utils/external-type';
import { IntersectionFaker } from '../../testing/data/fakers';
import { UserIdDto } from '../user-id.dto';
import { ReferencedByUserId } from '../../ReferenceBuilder/decorators';

import { UserProfileDto } from './user-profile.dto';
import { UserProfileUpdatesDto } from './user-profile-updates.dto';

@ExternalType<UserIdDto & Partial<UserProfileDto>>()
@ReferencedByUserId()
@IntersectionFaker(UserIdDto, UserProfileDto)
export class UpdateUserProfileDto extends IntersectionType(
  UserIdDto,
  UserProfileUpdatesDto,
) {}

import { IntersectionType } from '@nestjs/mapped-types';

import { IntersectionFaker } from '../../testing/data/fakers';
import { UserIdDto } from '../user-id.dto';
import { ReferencedByUserId } from '../../ReferenceBuilder/decorators';
import { ExternalType } from '../../utils/external-type';

import { UserProfileDto } from './user-profile.dto';

@ExternalType<UserIdDto & UserProfileDto>()
@ReferencedByUserId()
@IntersectionFaker(UserIdDto, UserProfileDto)
export class CreateUserProfileDto extends IntersectionType(
  UserIdDto,
  UserProfileDto,
) {}

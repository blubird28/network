import { Expose, Type } from 'class-transformer';

import { DeepFake } from '../../testing/data/fakers';
import { IdentityDto } from '../identity.dto';
import { ExternalType } from '../../utils/external-type';

import { UserProfileDto } from './user-profile.dto';

@ExternalType()
export class UserPublicDto extends IdentityDto {
  /**
   * The user's public profile
   */
  @Expose()
  @Type(() => UserProfileDto)
  @DeepFake(() => UserProfileDto)
  profile: UserProfileDto;
}

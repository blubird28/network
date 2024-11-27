import { Expose, Type } from 'class-transformer';

import { Fake } from '../../testing/data/fakers';
import { ExternalType } from '../../utils/external-type';
import { JOE_BLOGGS_EMAIL } from '../../testing/data/constants';

import { UserPublicDto } from './user-public.dto';

@ExternalType()
export class UserDetailDto extends UserPublicDto {
  /**
   * The user's email
   */
  @Expose()
  @Type(() => String)
  @Fake(JOE_BLOGGS_EMAIL)
  email: string;
}

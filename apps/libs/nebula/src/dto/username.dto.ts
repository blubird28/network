import { IsNotEmpty, IsString } from 'class-validator';
import { Expose, Type } from 'class-transformer';

import { DTOFaker } from '../testing/data/fakers/decorators/Faker';
import { Fake } from '../testing/data/fakers';
import { JOE_BLOGGS_USERNAME } from '../testing/data/constants';
import { ReferencedBy } from '../ReferenceBuilder/decorators';
import { ExternalType } from '../utils/external-type';
import Errors from '../Error';

@ExternalType()
@ReferencedBy<UsernameDto>(({ username }) => `username: ${username}`)
@DTOFaker()
export class UsernameDto {
  constructor(username: string) {
    this.username = username;
  }
  /**
   * The username to look up
   * @example joe_bloggs
   */
  @Fake(JOE_BLOGGS_USERNAME)
  @Expose()
  @Type(() => String)
  @IsString({ context: Errors.InvalidUsername.context })
  @IsNotEmpty({ context: Errors.InvalidUsername.context })
  readonly username: string;
}

import { IsEmail, IsNotEmpty } from 'class-validator';
import { Expose, Type } from 'class-transformer';

import { DTOFaker } from '../testing/data/fakers/decorators/Faker';
import { FakeEmail } from '../testing/data/fakers';
import { ReferencedBy } from '../ReferenceBuilder/decorators';
import { ExternalType } from '../utils/external-type';
import Errors from '../Error';

@ExternalType()
@ReferencedBy<EmailDto>(({ email }) => `email: ${email}`)
@DTOFaker()
export class EmailDto {
  /**
   * The email address of the user
   * @example joe.bloggs@bloggsnet.com
   */
  @FakeEmail()
  @Expose()
  @Type(() => String)
  @IsEmail({}, { context: Errors.InvalidEmail.context })
  @IsNotEmpty({ context: Errors.InvalidEmail.context })
  readonly email: string;
}

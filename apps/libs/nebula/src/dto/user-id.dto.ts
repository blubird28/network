import { IsNotEmpty, IsUUID } from 'class-validator';
import { Expose, Type } from 'class-transformer';

import { DTOFaker } from '../testing/data/fakers/decorators/Faker';
import { FakeUuid } from '../testing/data/fakers';
import { ReferencedByUserId } from '../ReferenceBuilder/decorators';
import { ExternalType } from '../utils/external-type';
import Errors from '../Error';

@ExternalType()
@ReferencedByUserId()
@DTOFaker()
export class UserIdDto {
  /**
   * The user ID to look up
   * @example 96711b0a-abfd-456b-b928-6e2ea29a87ac
   */
  @FakeUuid
  @Expose()
  @Type(() => String)
  @IsUUID(4, { context: Errors.InvalidUserId.context })
  @IsNotEmpty({ context: Errors.InvalidUserId.context })
  readonly userId: string;
}

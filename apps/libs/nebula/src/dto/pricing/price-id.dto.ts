import { IsNotEmpty, IsUUID } from 'class-validator';
import { Expose, Type } from 'class-transformer';

import { UUID_VERSION } from '@libs/nebula/utils/constants';

import { DTOFaker } from '../../testing/data/fakers/decorators/Faker';
import { FakeUuid } from '../../testing/data/fakers';
import { ExternalType } from '../../utils/external-type';
import Errors from '../../Error';

@ExternalType()
@DTOFaker()
export class PriceIdDto {
  /**
   * The price ID to look up
   * @example 96711b0a-abfd-456b-b928-6e2ea29a87ap
   */
  @FakeUuid
  @Expose()
  @Type(() => String)
  @IsUUID(UUID_VERSION, { context: Errors.InvalidPriceId.context })
  @IsNotEmpty({ context: Errors.InvalidPriceId.context })
  readonly id: string;
}

import { IsNotEmpty, IsUUID } from 'class-validator';
import { Expose, Type } from 'class-transformer';

import { UUID_VERSION } from '@libs/nebula/utils/constants';

import { DTOFaker } from '../../testing/data/fakers/decorators/Faker';
import { FakeUuid } from '../../testing/data/fakers';
import { ExternalType } from '../../utils/external-type';
import Errors from '../../Error';

@ExternalType()
@DTOFaker()
export class PriceRequestIdentifierDto {
  /**
   * The price-request ID to look up
   * @example 96711b0a-abfd-456b-b928-6e2ea29a87ac
   */
  @FakeUuid
  @Expose()
  @Type(() => String)
  @IsUUID(UUID_VERSION, { context: Errors.InvalidPriceRequestId.context })
  @IsNotEmpty({ context: Errors.InvalidPriceRequestId.context })
  readonly priceRequestId: string;
}

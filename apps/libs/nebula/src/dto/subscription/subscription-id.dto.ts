import { Expose, Type } from 'class-transformer';
import { IsNotEmpty, MaxLength } from 'class-validator';

import Errors from '@libs/nebula/Error';
import { MAX_LENGTH_8 } from '@libs/nebula/subscription/subscription.constants';

import { DTOFaker } from '../../testing/data/fakers/decorators/Faker';
import { FakeUuid } from '../../testing/data/fakers';
import { ExternalType } from '../../utils/external-type';

@ExternalType()
@DTOFaker()
export class SubscriptionIdDto {
  @FakeUuid
  @Expose()
  @Type(() => String)
  @MaxLength(MAX_LENGTH_8, { context: Errors.InvalidSubscriptionId.context })
  @IsNotEmpty({ context: Errors.InvalidSubscriptionId.context })
  readonly id: string;
}

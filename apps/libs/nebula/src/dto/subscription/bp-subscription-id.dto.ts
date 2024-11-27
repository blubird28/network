import { Expose, Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

import Errors from '@libs/nebula/Error';
import { FAKE_OBJECT_ID } from '@libs/nebula/testing/data/constants';

import { DTOFaker } from '../../testing/data/fakers/decorators/Faker';
import { Fake } from '../../testing/data/fakers';
import { ExternalType } from '../../utils/external-type';

@ExternalType()
@DTOFaker()
export class BPSubscriptionIdDto {
  @Fake(FAKE_OBJECT_ID)
  @Expose()
  @Type(() => String)
  @IsNotEmpty({ context: Errors.InvalidSubscriptionId.context })
  readonly id: string;
}

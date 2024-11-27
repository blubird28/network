import { Expose, Type } from 'class-transformer';
import { IsString } from 'class-validator';

import { DTOFaker } from '@libs/nebula/testing/data/fakers/decorators/Faker';
import { ExternalType } from '@libs/nebula/utils/external-type';
import { Fake } from '@libs/nebula/testing/data/fakers';
import { FAKE_SUBSCRIPTION_RESPONSE } from '@libs/nebula/testing/data/constants';

import { BPSubscriptionDto } from './bp-subscription.dto';

@ExternalType()
@DTOFaker()
export class BPSubscriptionResponseDto extends BPSubscriptionDto {
  @Fake(FAKE_SUBSCRIPTION_RESPONSE.subscriptionId)
  @Expose()
  @IsString()
  @Type(() => String)
  readonly subscriptionId: string;
}

import { Expose, Type } from 'class-transformer';

import { FAKE_SUBSCRIPTION_RESPONSE } from '@libs/nebula/testing/data/constants';

import { DTOFaker } from '../../testing/data/fakers/decorators/Faker';
import { Fake } from '../../testing/data/fakers';
import { ExternalType } from '../../utils/external-type';

@ExternalType()
@DTOFaker()
export class SubscriptionResponseDto {
  @Fake(FAKE_SUBSCRIPTION_RESPONSE.message)
  @Expose()
  @Type(() => String)
  readonly message: string;

  @Fake(FAKE_SUBSCRIPTION_RESPONSE.subscriptionId)
  @Expose()
  @Type(() => String)
  readonly subscriptionId: string;

  constructor(message, subscriptionId) {
    this.message = message;
    this.subscriptionId = subscriptionId;
  }
}

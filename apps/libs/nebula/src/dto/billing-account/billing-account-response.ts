import { Expose, Type } from 'class-transformer';

import { FAKE_BILLING_ACCOUNT_RESPONSE } from '@libs/nebula/testing/data/constants';

import { DTOFaker } from '../../testing/data/fakers/decorators/Faker';
import { Fake } from '../../testing/data/fakers';
import { ExternalType } from '../../utils/external-type';
import { UUIDProp } from '../decorators/StringProp.decorator';

@ExternalType()
@DTOFaker()
export class BillingAccountResponseDto {
  @Fake(FAKE_BILLING_ACCOUNT_RESPONSE.message)
  @Expose()
  @Type(() => String)
  readonly message: string;

  @Fake(FAKE_BILLING_ACCOUNT_RESPONSE.id)
  @Expose()
  @Type(() => String)
  readonly id: string;

  @UUIDProp()
  readonly billingProfileUuid: string;

  constructor(message, id, billingProfileUuid) {
    this.message = message;
    this.id = id;
    this.billingProfileUuid = billingProfileUuid;
  }
}

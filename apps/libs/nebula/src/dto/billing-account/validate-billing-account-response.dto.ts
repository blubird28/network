import { Expose, Type } from 'class-transformer';

import { DTOFaker } from '../../testing/data/fakers/decorators/Faker';
import { Fake } from '../../testing/data/fakers';

@DTOFaker()
export class ValidateBillingAccountResponseDto {
  @Fake('One or more billing accounts is eligible for Console Connect ordering')
  @Expose()
  @Type(() => String)
  readonly message: string;

  @Fake(true)
  @Expose()
  @Type(() => Boolean)
  readonly hasValidBillingAccounts: boolean;

  constructor(hasValidBillingAccount, message) {
    this.hasValidBillingAccounts = hasValidBillingAccount;
    this.message = message;
  }
}

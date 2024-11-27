import { IsString, IsNotEmpty } from 'class-validator';
import { Expose } from 'class-transformer';

import { FAKE_BILLING_REQUEST } from '@libs/nebula/testing/data/constants';
import { Fake } from '@libs/nebula/testing/data/fakers';
import { DTOFaker } from '@libs/nebula/testing/data/fakers/decorators/Faker';
import { ExternalType } from '@libs/nebula/utils/external-type';

import { BillingAccountRequestDto } from './billing-account-request.dto';

@DTOFaker()
@ExternalType()
export class AdminBillingAccountRequestDto extends BillingAccountRequestDto {
  @Fake(FAKE_BILLING_REQUEST.crm_customer_id)
  @IsString()
  @IsNotEmpty()
  @Expose()
  crmCustomerId: string;
}

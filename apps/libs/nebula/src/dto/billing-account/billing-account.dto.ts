import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { Expose } from 'class-transformer';

import { FAKE_BILLING_REQUEST } from '@libs/nebula/testing/data/constants';
import { Fake } from '@libs/nebula/testing/data/fakers';
import { DTOFaker } from '@libs/nebula/testing/data/fakers/decorators/Faker';
import { ExternalType } from '@libs/nebula/utils/external-type';
import { IsAnyUUID } from '@libs/nebula/utils/decorators/isAnyUUID.decorator';

import { AdminBillingAccountRequestDto } from './admin-billing-account-request.dto';

@DTOFaker()
@ExternalType()
export class BillingAccountDto extends AdminBillingAccountRequestDto {
  @Fake(FAKE_BILLING_REQUEST.bp_account_id)
  @IsString()
  @IsNotEmpty()
  @Expose({ name: 'bpAccountId' })
  readonly bpAccountId: string;

  @Fake(FAKE_BILLING_REQUEST.bp_billing_profile_uuid)
  @IsString()
  @IsNotEmpty()
  @IsAnyUUID()
  @Expose({ name: 'bpBillingProfileUuid' })
  readonly bpBillingProfileUuid: string;

  @IsString()
  @IsOptional()
  @Expose({ name: 'paymentMethodText' })
  readonly paymentMethodText?: string;
}

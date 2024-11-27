import { IsNotEmpty, IsEmail, IsString } from 'class-validator';
import { Expose, Transform } from 'class-transformer';

import { FAKE_BILLING_REQUEST } from '@libs/nebula/testing/data/constants';
import { Fake } from '@libs/nebula/testing/data/fakers';
import { DTOFaker } from '@libs/nebula/testing/data/fakers/decorators/Faker';
import { IsAnyUUID } from '@libs/nebula/utils/decorators/isAnyUUID.decorator';

import { BillingAccountBaseDto } from './billing-account-base.dto';

@DTOFaker()
export class ManualSyncBillingAccountCrmBaseDto extends BillingAccountBaseDto {
  @Fake(FAKE_BILLING_REQUEST.bp_account_id)
  @IsString()
  @IsNotEmpty()
  @Expose({ name: 'id' })
  readonly bpAccountId: string;

  @Fake(FAKE_BILLING_REQUEST.bp_billing_profile_uuid)
  @IsString()
  @IsAnyUUID()
  @Transform(({ value }) => value ?? '')
  @Expose({ name: 'billingProfileUuid' })
  readonly bpBillingProfileUuid: string;

  @Fake(FAKE_BILLING_REQUEST.pccw_epi_comp_id)
  @IsString()
  @IsNotEmpty()
  @Expose({ name: 'pccwEpiCompCode' })
  readonly pccwEpiCompId: string;

  @Fake(FAKE_BILLING_REQUEST.bill_contact_email)
  @IsEmail()
  @IsNotEmpty()
  @Expose({ name: 'email' })
  readonly billContactEmail: string;

  @Fake(FAKE_BILLING_REQUEST.crm_customer_id)
  @IsEmail()
  @IsNotEmpty()
  @Expose({ name: 'crmCustomerId' })
  readonly crmCustomerId: string;

  @Fake(FAKE_BILLING_REQUEST.country)
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value ?? '')
  @Expose()
  readonly country: string;
}

import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { Expose, Type } from 'class-transformer';

import {
  COMPANY,
  FAKE_BILLING_REQUEST,
  FAKE_NUMBER,
} from '@libs/nebula/testing/data/constants';
import { Fake } from '@libs/nebula/testing/data/fakers';
import { DTOFaker } from '@libs/nebula/testing/data/fakers/decorators/Faker';

@DTOFaker()
export class BillingAccountDetailsDto {
  @Fake(FAKE_BILLING_REQUEST.crm_customer_id)
  @Expose()
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  readonly insightCRMId: string;

  @Fake(FAKE_NUMBER)
  @Expose()
  @Type(() => Number)
  @IsString()
  @IsNotEmpty()
  readonly billingEntityId: number;

  @Fake(FAKE_BILLING_REQUEST.invoice_currency)
  @Expose()
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  readonly currency: string;

  @Fake(FAKE_BILLING_REQUEST.bp_account_id)
  @Expose()
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  readonly billingAccountId: string;

  @Fake(true)
  @Expose()
  @Type(() => Boolean)
  @IsBoolean()
  @IsNotEmpty()
  readonly validated: boolean;

  @Fake(COMPANY.name)
  @Expose()
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  readonly companyName: string;

  constructor(
    billingAccount,
    insightId,
    signedCompanyRefId,
    name,
    currency,
    validated,
  ) {
    this.billingAccountId = billingAccount;
    this.insightCRMId = insightId;
    this.billingEntityId = signedCompanyRefId;
    this.currency = currency;
    this.validated = validated;
    this.companyName = name;
  }
}

import { IsNotEmpty, IsString } from 'class-validator';
import { Expose, Type } from 'class-transformer';

import { FAKE_BILLING_REQUEST } from '@libs/nebula/testing/data/constants';
import { Fake } from '@libs/nebula/testing/data/fakers';
import { DTOFaker } from '@libs/nebula/testing/data/fakers/decorators/Faker';

import StringProp from '../decorators/StringProp.decorator';
import DateProp from '../decorators/DateProp.decorator';

@DTOFaker()
export class BPBillingAccountDto {
  @Fake(FAKE_BILLING_REQUEST.bp_account_id)
  @Expose()
  @Type(() => String)
  readonly id: string;

  @Fake(FAKE_BILLING_REQUEST.crm_customer_id)
  @Expose()
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  readonly crmCustomerId: string;

  @Fake(FAKE_BILLING_REQUEST.pccw_epi_comp_id)
  @Expose()
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  readonly pccwEpiCompCode: string;

  @Fake(FAKE_BILLING_REQUEST.invoice_currency)
  @Expose()
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  readonly invoiceCurrency: string;

  @StringProp({
    allowEmpty: false,
    fake: FAKE_BILLING_REQUEST.invoice_timezone,
  })
  readonly invoiceTimezone: string;

  @StringProp({
    allowEmpty: false,
    fake: FAKE_BILLING_REQUEST.our_contract_email,
  })
  readonly ourContractEmail: string;

  @StringProp({
    allowEmpty: false,
    fake: FAKE_BILLING_REQUEST.account_type,
  })
  readonly accountType: string;

  @StringProp({
    allowEmpty: false,
    fake: FAKE_BILLING_REQUEST.payment_method,
  })
  readonly paymentMethod: string;

  @DateProp()
  readonly createdAt: string;

  @DateProp()
  readonly updatedAt: string;
}

import {
  IsBoolean,
  IsNotEmpty,
  IsEmail,
  IsString,
  IsOptional,
} from 'class-validator';
import { Expose, Transform } from 'class-transformer';

import { FAKE_BILLING_REQUEST } from '@libs/nebula/testing/data/constants';
import { Fake } from '@libs/nebula/testing/data/fakers';
import { DTOFaker } from '@libs/nebula/testing/data/fakers/decorators/Faker';
import { IsAnyUUID } from '@libs/nebula/utils/decorators/isAnyUUID.decorator';

@DTOFaker()
export class SyncBillingAccountBaseDto {
  @Fake(FAKE_BILLING_REQUEST.bp_account_id)
  @IsString()
  @IsNotEmpty()
  @Expose({ name: 'id' })
  readonly bpAccountId: string;

  @Fake(FAKE_BILLING_REQUEST.bp_billing_profile_uuid)
  @IsString()
  @IsNotEmpty()
  @IsAnyUUID()
  @Expose({ name: 'billing_profile_uuid' })
  readonly bpBillingProfileUuid: string;

  @Fake(FAKE_BILLING_REQUEST.name)
  @IsString()
  @IsNotEmpty()
  @Expose({ name: 'name' })
  readonly name: string;

  @Fake(FAKE_BILLING_REQUEST.crm_customer_id)
  @IsString()
  @IsNotEmpty()
  @Expose({ name: 'crm_customer_id' })
  readonly crmCustomerId: string;

  @Fake(FAKE_BILLING_REQUEST.pccw_epi_comp_id)
  @IsString()
  @IsNotEmpty()
  @Expose({ name: 'pccw_epi_comp_id' })
  readonly pccwEpiCompId: string;

  @Fake(FAKE_BILLING_REQUEST.rate_hierarchy)
  @IsBoolean()
  @IsOptional()
  @Expose({ name: 'rate_hierarchy' })
  readonly rateHierarchy?: boolean;

  @Fake(FAKE_BILLING_REQUEST.country)
  @IsString()
  @IsNotEmpty()
  @Expose({ name: 'country' })
  readonly country: string;

  @Fake(FAKE_BILLING_REQUEST.address)
  @IsString()
  @IsNotEmpty()
  @Expose({ name: 'address' })
  readonly address: string;

  @Fake(FAKE_BILLING_REQUEST.city)
  @IsString()
  @IsOptional()
  @Expose({ name: 'city' })
  readonly city?: string;

  @Fake(FAKE_BILLING_REQUEST.attention)
  @IsString()
  @IsNotEmpty()
  @Expose({ name: 'attention' })
  readonly attention: string;

  @Fake(FAKE_BILLING_REQUEST.invoice_currency)
  @IsString()
  @IsNotEmpty()
  @Expose({ name: 'invoice_currency' })
  readonly invoiceCurrency: string;

  @Fake(FAKE_BILLING_REQUEST.billing_cycle)
  @IsString()
  @IsNotEmpty()
  @Expose({ name: 'billing_cycle' })
  readonly billingCycle: string;

  @Fake(FAKE_BILLING_REQUEST.bill_to)
  @IsString()
  @IsNotEmpty()
  @Expose({ name: 'bill_to' })
  readonly billTo: string;

  @Fake(FAKE_BILLING_REQUEST.bill_contact_email)
  @IsEmail()
  @IsNotEmpty()
  @Expose({ name: 'bill_contact_email' })
  readonly billContactEmail: string;

  @Fake(FAKE_BILLING_REQUEST.bill_contact_phone)
  @IsString()
  @IsOptional()
  @Expose({ name: 'bill_contact_phone' })
  @Transform(({ value }) => value ?? '')
  readonly billContactPhone?: string;

  @Fake(FAKE_BILLING_REQUEST.allow_pricing_in_different_currency)
  @IsBoolean()
  @IsOptional()
  @Expose({ name: 'allow_pricing_in_different_currency' })
  readonly allowPricingInDifferentCurrency?: boolean;

  @Fake(FAKE_BILLING_REQUEST.invoice_delivery_method)
  @IsString()
  @IsOptional()
  @Expose({ name: 'invoice_delivery_method' })
  readonly invoiceDeliveryMethod?: string;

  @Fake(FAKE_BILLING_REQUEST.bill_contact_fax)
  @IsString()
  @IsOptional()
  @Expose({ name: 'bill_contact_fax' })
  readonly billContactFax?: string;

  @Fake(FAKE_BILLING_REQUEST.payment_method_text)
  @IsString()
  @IsOptional()
  @Expose({ name: 'payment_method_text' })
  readonly paymentMethodText?: string;

  @Fake(FAKE_BILLING_REQUEST.payment_method)
  @IsString()
  @IsOptional()
  @Expose({ name: 'payment_method' })
  readonly paymentMethod?: string;

  @Fake(FAKE_BILLING_REQUEST.zip_code)
  @IsString()
  @IsOptional()
  @Expose({ name: 'zip_code' })
  @Transform(({ value }) => value ?? '')
  readonly zipCode?: string;

  @Fake(FAKE_BILLING_REQUEST.sales_contact_email)
  @IsEmail()
  @IsNotEmpty()
  @Expose({ name: 'sales_contact_email' })
  readonly salesContactEmail: string;

  @Fake(FAKE_BILLING_REQUEST.payment_term_days)
  @IsString()
  @IsNotEmpty()
  @Expose({ name: 'payment_term_days' })
  readonly paymentTermDays: string;

  @Fake(FAKE_BILLING_REQUEST.sales_contact_name)
  @IsString()
  @IsNotEmpty()
  @Expose({ name: 'sales_contact_name' })
  readonly salesContactName: string;
}

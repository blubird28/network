import {
  IsBoolean,
  IsNotEmpty,
  IsEmail,
  IsString,
  IsOptional,
} from 'class-validator';
import { Expose } from 'class-transformer';

import { FAKE_BILLING_REQUEST } from '@libs/nebula/testing/data/constants';
import { Fake } from '@libs/nebula/testing/data/fakers';
import { DTOFaker } from '@libs/nebula/testing/data/fakers/decorators/Faker';
import { ExternalType } from '@libs/nebula/utils/external-type';

@DTOFaker()
@ExternalType()
export class BillingAccountBaseDto {
  @Fake(FAKE_BILLING_REQUEST.name)
  @IsString()
  @IsNotEmpty()
  @Expose()
  readonly name: string;

  @Fake(FAKE_BILLING_REQUEST.companyId)
  @IsString()
  @IsNotEmpty()
  @Expose()
  readonly companyId: string;

  @Fake(FAKE_BILLING_REQUEST.pccw_epi_comp_code)
  @IsString()
  @IsNotEmpty()
  @Expose()
  readonly pccwEpiCompId: string;

  @Fake(FAKE_BILLING_REQUEST.crm_customer_id)
  @IsString()
  @IsNotEmpty()
  crmCustomerId?: string;

  @Fake(FAKE_BILLING_REQUEST.allow_pricing_in_different_currency)
  @IsBoolean()
  @IsOptional()
  @Expose()
  readonly allowPricingInDifferentCurrency?: boolean;

  @Fake(FAKE_BILLING_REQUEST.rate_hierarchy)
  @IsBoolean()
  @IsOptional()
  @Expose()
  readonly rateHierarchy?: boolean;

  @Fake(FAKE_BILLING_REQUEST.invoice_currency)
  @IsString()
  @IsNotEmpty()
  @Expose()
  readonly invoiceCurrency: string;

  @Fake(FAKE_BILLING_REQUEST.address)
  @IsString()
  @IsNotEmpty()
  @Expose()
  readonly address: string;

  @Fake(FAKE_BILLING_REQUEST.attention)
  @IsString()
  @IsNotEmpty()
  @Expose()
  readonly attention: string;

  @Fake(FAKE_BILLING_REQUEST.bill_to)
  @IsString()
  @IsNotEmpty()
  @Expose()
  readonly billTo: string;

  @Fake(FAKE_BILLING_REQUEST.billing_cycle)
  @IsString()
  @IsNotEmpty()
  @Expose()
  readonly billingCycle: string;

  @Fake(FAKE_BILLING_REQUEST.city)
  @IsString()
  @IsOptional()
  @Expose()
  readonly city?: string;

  @Fake(FAKE_BILLING_REQUEST.country)
  @IsString()
  @IsNotEmpty()
  @Expose()
  readonly country: string;

  @Fake(FAKE_BILLING_REQUEST.bill_contact_email)
  @IsEmail()
  @IsNotEmpty()
  @Expose()
  readonly billContactEmail: string;

  @Fake(FAKE_BILLING_REQUEST.bill_contact_phone)
  @IsString()
  @IsOptional()
  @Expose()
  readonly billContactPhone?: string;

  @Fake(FAKE_BILLING_REQUEST.bill_contact_fax)
  @IsString()
  @IsOptional()
  @Expose()
  readonly billContactFax?: string;

  @Fake(FAKE_BILLING_REQUEST.invoice_delivery_method)
  @IsString()
  @IsOptional()
  @Expose()
  readonly invoiceDeliveryMethod?: string;

  @Fake(FAKE_BILLING_REQUEST.payment_method)
  @IsString()
  @IsOptional()
  @Expose()
  readonly paymentMethod?: string;

  @Fake(FAKE_BILLING_REQUEST.payment_term_days)
  @IsString()
  @IsNotEmpty()
  @Expose()
  readonly paymentTermDays: string;

  @Fake(FAKE_BILLING_REQUEST.zip_code)
  @IsString()
  @IsOptional()
  @Expose()
  readonly zipCode?: string;

  @Fake(FAKE_BILLING_REQUEST.sales_contact_email)
  @IsEmail()
  @IsNotEmpty()
  @Expose()
  readonly salesContactEmail: string;

  @Fake(FAKE_BILLING_REQUEST.sales_contact_name)
  @IsString()
  @IsNotEmpty()
  @Expose()
  readonly salesContactName: string;

  @Fake(FAKE_BILLING_REQUEST.our_contract_email)
  @IsEmail()
  @IsNotEmpty()
  @Expose()
  readonly ourContractEmail: string;
}

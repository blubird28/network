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

@DTOFaker()
export class BPBillingAccountRequestDto {
  @Fake(FAKE_BILLING_REQUEST.name)
  @IsString()
  @IsNotEmpty()
  @Expose({ name: 'name' })
  readonly name: string;

  @Fake(FAKE_BILLING_REQUEST.crm_customer_id)
  @IsString()
  @IsNotEmpty()
  @Expose({ name: 'crmCustomerId' })
  readonly crmCustomerId: string;

  @Fake(FAKE_BILLING_REQUEST.pccw_epi_comp_id)
  @IsString()
  @IsNotEmpty()
  @Expose({ name: 'pccwEpiCompId' })
  readonly pccwEpiCompId: string;

  @Fake(FAKE_BILLING_REQUEST.pccw_epi_comp_id)
  @IsString()
  @IsOptional()
  readonly pccwEpiCompCode: string;

  @Fake(FAKE_BILLING_REQUEST.allow_pricing_in_different_currency)
  @IsBoolean()
  @IsOptional()
  @Expose({ name: 'allowPricingInDifferentCurrency' })
  readonly allowPricingInDifferentCurrency?: boolean;

  @Fake(FAKE_BILLING_REQUEST.rate_hierarchy)
  @IsBoolean()
  @IsOptional()
  @Expose({ name: 'rateHierarchy' })
  readonly rateHierarchy?: boolean;

  @Fake(FAKE_BILLING_REQUEST.invoice_currency)
  @IsString()
  @IsNotEmpty()
  @Expose({ name: 'invoiceCurrency' })
  readonly invoiceCurrency: string;

  @Fake(FAKE_BILLING_REQUEST.address)
  @IsString()
  @IsNotEmpty()
  @Expose({ name: 'address' })
  readonly address: string;

  @Fake(FAKE_BILLING_REQUEST.attention)
  @IsString()
  @IsNotEmpty()
  @Expose({ name: 'attention' })
  readonly attention: string;

  @Fake(FAKE_BILLING_REQUEST.bill_to)
  @IsString()
  @IsNotEmpty()
  @Expose({ name: 'billTo' })
  readonly billTo: string;

  @Fake(FAKE_BILLING_REQUEST.billing_cycle)
  @IsString()
  @IsNotEmpty()
  @Expose({ name: 'billingCycle' })
  readonly billingCycle: string;

  @Fake(FAKE_BILLING_REQUEST.city)
  @IsString()
  @IsOptional()
  @Expose({ name: 'city' })
  readonly city?: string;

  @Fake(FAKE_BILLING_REQUEST.country)
  @IsString()
  @IsNotEmpty()
  @Expose({ name: 'country' })
  readonly country: string;

  @Fake(FAKE_BILLING_REQUEST.bill_contact_email)
  @IsEmail()
  @IsNotEmpty()
  @Expose({ name: 'billContactEmail' })
  readonly billContactEmail: string;

  @Fake(FAKE_BILLING_REQUEST.bill_contact_phone)
  @IsString()
  @IsOptional()
  @Expose({ name: 'billContactPhone' })
  readonly billContactPhone?: string;

  @Fake(FAKE_BILLING_REQUEST.bill_contact_fax)
  @IsString()
  @IsOptional()
  @Expose({ name: 'billContactFax' })
  readonly billContactFax?: string;

  @Fake(FAKE_BILLING_REQUEST.invoice_delivery_method)
  @IsString()
  @IsOptional()
  @Expose({ name: 'invoiceDeliveryMethod' })
  readonly invoiceDeliveryMethod?: string;

  @Fake(FAKE_BILLING_REQUEST.payment_method)
  @IsString()
  @IsOptional()
  @Expose({ name: 'paymentMethod' })
  readonly paymentMethod?: string;

  @Fake(FAKE_BILLING_REQUEST.payment_term_days)
  @IsString()
  @IsNotEmpty()
  @Expose({ name: 'paymentTermDays' })
  readonly paymentTermDays: string;

  @Fake(FAKE_BILLING_REQUEST.zip_code)
  @IsString()
  @IsOptional()
  @Expose({ name: 'zipCode' })
  readonly zipcode?: string;

  @Fake(FAKE_BILLING_REQUEST.sales_contact_email)
  @IsEmail()
  @IsNotEmpty()
  @Expose({ name: 'salesContactEmail' })
  readonly salesContactEmail: string;

  @Fake(FAKE_BILLING_REQUEST.sales_contact_name)
  @IsString()
  @IsNotEmpty()
  @Expose({ name: 'salesContactName' })
  readonly salesContactName: string;

  @Fake(FAKE_BILLING_REQUEST.our_contract_email)
  @IsEmail()
  @IsNotEmpty()
  @Expose({ name: 'ourContractEmail' })
  readonly ourContractEmail: string;
}

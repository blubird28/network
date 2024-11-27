import { Expose } from 'class-transformer';

import {
  FAKE_BILLING_REQUEST,
  FAKE_COMPANY_DETAILS,
} from '@libs/nebula/testing/data/constants';
import { DTOFaker } from '@libs/nebula/testing/data/fakers/decorators/Faker';
import Errors from '@libs/nebula/Error';
import { Fake } from '@libs/nebula/testing/data/fakers';

import StringProp, { UUIDProp } from '../decorators/StringProp.decorator';
import BooleanProp from '../decorators/BooleanProp.decorator';
import DateProp from '../decorators/DateProp.decorator';

import { CompanyDetails } from './company-details.dto';

@DTOFaker()
export class AdminViewBillingAccountDetails {
  @StringProp({
    allowEmpty: false,
    fake: FAKE_BILLING_REQUEST.bp_account_id,
    error: Errors.InvalidBillingAccountId,
  })
  readonly bpAccountId: string;

  @UUIDProp()
  readonly bpBillingProfileUuid: string;

  @StringProp({
    allowEmpty: false,
    fake: FAKE_BILLING_REQUEST.name,
  })
  readonly name: string;

  @StringProp({
    allowEmpty: false,
    fake: FAKE_BILLING_REQUEST.crm_customer_id,
  })
  readonly crmCustomerId: string;

  @StringProp({
    allowEmpty: false,
    fake: FAKE_BILLING_REQUEST.pccw_epi_comp_id,
  })
  readonly pccwEpiCompId: string;

  @BooleanProp({
    optional: true,
    fake: FAKE_BILLING_REQUEST.rate_hierarchy,
  })
  readonly rateHierarchy?: boolean;

  @BooleanProp({
    optional: false,
    fake: FAKE_BILLING_REQUEST.invoice_at_this_level,
  })
  readonly invoiceAtThisLevel: boolean;

  @StringProp({
    allowEmpty: false,
    fake: FAKE_BILLING_REQUEST.invoice_currency,
  })
  readonly invoiceCurrency: string;

  @StringProp({
    allowEmpty: false,
    fake: FAKE_BILLING_REQUEST.address,
  })
  readonly address: string;

  @StringProp({
    allowEmpty: false,
    fake: FAKE_BILLING_REQUEST.attention,
  })
  readonly attention: string;

  @StringProp({
    allowEmpty: false,
    fake: FAKE_BILLING_REQUEST.bill_to,
  })
  readonly billTo: string;

  @StringProp({
    allowEmpty: false,
    fake: FAKE_BILLING_REQUEST.billing_cycle,
  })
  readonly billingCycle: string;

  @StringProp({
    fake: FAKE_BILLING_REQUEST.city,
    optional: true,
  })
  readonly city?: string;

  @StringProp({
    allowEmpty: false,
    fake: FAKE_BILLING_REQUEST.country,
  })
  readonly country: string;

  @StringProp({
    allowEmpty: false,
    fake: FAKE_BILLING_REQUEST.bill_contact_email,
  })
  readonly billContactEmail: string;

  @StringProp({
    fake: FAKE_BILLING_REQUEST.bill_contact_phone,
    optional: true,
  })
  readonly billContactPhone?: string;

  @StringProp({
    fake: FAKE_BILLING_REQUEST.payment_method,
    optional: true,
  })
  readonly paymentMethod?: string;

  @StringProp({
    allowEmpty: false,
    fake: FAKE_BILLING_REQUEST.payment_term_days,
  })
  readonly paymentTermDays: string;

  @StringProp({
    fake: FAKE_BILLING_REQUEST.zip_code,
    optional: true,
  })
  readonly zipCode?: string;

  @StringProp({
    allowEmpty: false,
    fake: FAKE_BILLING_REQUEST.sales_contact_email,
  })
  readonly salesContactEmail: string;

  @StringProp({
    allowEmpty: false,
    fake: FAKE_BILLING_REQUEST.sales_contact_name,
  })
  readonly salesContactName: string;

  @StringProp({
    allowEmpty: false,
    fake: FAKE_BILLING_REQUEST.companyId,
  })
  readonly companyId: string;

  @StringProp({
    allowEmpty: false,
    fake: FAKE_BILLING_REQUEST.payment_method_text,
  })
  readonly paymentMethodText: string;

  @BooleanProp({
    optional: true,
    fake: FAKE_BILLING_REQUEST.separate_service_invoice,
  })
  readonly separateService?: boolean;

  @DateProp()
  readonly createdAt: string;

  @DateProp()
  readonly updatedAt: string;

  @Fake(FAKE_COMPANY_DETAILS)
  @Expose({ name: 'company' })
  readonly company: CompanyDetails;

  @BooleanProp({
    optional: true,
    fake: FAKE_BILLING_REQUEST.is_default,
  })
  readonly isDefault: boolean;
}

import {
  AttributeRecord,
  CamundaVariable,
  CamundaVariables,
} from '../../basic-types';
import { CRMCompany } from '../../dto/crm-sync/company/crm-company.interface';
import { CRMUser } from '../../dto/crm-sync/user/crm-user.interface';

// Dates
export const FIRST_JAN_2020 = new Date(Date.UTC(2020, 0)); // Generally use this as a default for fakers
export const MOMENT_FORMATTED_FIRST_JAN_2020 = 'January 1st 2020, 12:00:00 am';
export const FIRST_JAN_2020_STRING = '2020-01-01';
export const MOMENT_FORMATTED_FIRST_JAN_2020_STRING =
  'January 1st 2020, 12:00:00 am';
export const FIRST_MAR_2020 = new Date(Date.UTC(2020, 2)); // Generally use this to override a faker default for testing updates, etc
export const MOMENT_FORMATTED_FIRST_MAR_2020 = 'March 1st 2020, 12:00:00 am';
export const DD_MM_YY_MOMENT_FORMATTED_FIRST_MAR_2020 = '01-03-2020';
export const FIRST_JUN_2020 = new Date(Date.UTC(2020, 5)); // Generally use this to override a faker default for testing updates, etc
export const FAKE_ISO8601_DATE = '2023-01-01';
export const MOMENT_FORMATTED_FAKE_ISO8601_DATE = '01-01-2023';
export const JS_INVALID_DATE = 'Invalid Date';
export const MOMENT_INVALID_DATE = 'Invalid date';
export const EMPTY_STRING = '';
export const JOE_BLOGGS_EMAIL = 'joe.bloggs@bloggsnet.com';
export const JOE_BLOGGS_OTHER_EMAIL = 'joe.bloggs@bloggocorp.com';
export const JOE_BLOGGS_USERNAME = 'joe_bloggs';
export const JOE_BLOGGS_NAME = 'Joe Bloggs';
export const JOE_BLOGGS_FIRSTNAME = 'Joe';
export const JOE_BLOGGS_LASTNAME = 'Bloggs';
export const JOE_BLOGGS_AVATAR_URL =
  'http://some-url/api/user/joe_bloggs/avatarNoResize';
export const ACME_NAME = 'Acme Inc.';
export const ACME_USERNAME = 'acme-inc';
export const ACME_BRN = 'AB 123.4.567.890-1';
export const ACME_PHONE = '0102030405';
export const ACME_DOMAIN = 'acme.test';
export const ACME_COUNTRY = 'AU';
export const ACME_STATE = 'Qld';
export const ACME_ZIP = '4000';
export const ACME_ADDRESS = '123 Test st';
export const ACME_WEBSITE = `https://www.${ACME_DOMAIN}`;
export const ACME_DESCRIPTION = 'a test company';
export const ACME_CITY = 'Brisbane';
export const ACME_BUSINESS_TYPE = 'Enterprise';

export const ACME_INSIGHT_ID = 'ACM123';
export const ACME_BUSINESS_SEGMENT = 'Enterprise';
export const ACME_CRM_INTERNAL_FLAG = false;
export const JOE_BLOGGS_HEADLINE = 'Breaking News! Man bites dog';
export const JOE_BLOGGS_PHONE = '(+61) 01 0203 0405';

export const FAKE_HASH = 'BROWNS';
export const FAKE_MD5_HASH = '8b1a9953c4611296a827abf8c47804d7';
export const FAKE_SALT = 'DELICIOUS';
export const FAKE_OBJECT_ID = '62a02730407271eeb4f86463';
export const FAKE_CRM_ID = '123456789';
export const FAKE_UUID = '96711b0a-abfd-456b-b928-6e2ea29a87ac';
export const FAKE_UUID_V1 = '1b8be8f6-2b61-11ee-b1fd-de72491f6fc1';
export const FAKE_TOKEN = 'Bearer 66374673fdg67676s';
export const FAKE_COSTBOOK_LOCATION_NAME = 'ASIA-1';
export const FAKE_PACKAGE_PRODUCT_ID = '12559';
export const FAKE_BP_PACKAGE_ID = '62a02730407271eeb4f86463';
export const FAKE_APPLICATION_SOURCE = 'ConsoleDisconnect';
export const FAKE_CONTRACT_START_DATE = '2024-01-01';
export const FAKE_CONTRACT_END_DATE = '2027-12-31';
export const FAKE_SERVICE_ID = 'SRV0000000';

export const OBJECT_ID_REGEX = /^[a-f\d]{24}$/i;
export const objectIdMatcher = () => expect.stringMatching(OBJECT_ID_REGEX);
export const FAKE_PRIVATE_ASN = 4200007324;

export const uuidV4Regex = new RegExp(
  /^[\dA-F]{8}-[\dA-F]{4}-4[\dA-F]{3}-[89AB][\dA-F]{3}-[\dA-F]{12}$/i,
);
export const uuidMatcher = () => expect.stringMatching(uuidV4Regex);
export const FAKE_PRICE_SCHEMA = {
  $id: 'test.json#',
  type: 'object',
  properties: {
    sku: { type: 'string' },
    businessType: { type: 'string', enum: ['ENTERPRISE', 'VALUE2'] },
  },
  required: ['businessType'],
};

export const FAKE_CRM_COMPANY: CRMCompany = {
  domain: ACME_DOMAIN,
  name: ACME_NAME,
  country: ACME_COUNTRY,
  businessRegistrationNumber: ACME_BRN,
  state: ACME_STATE,
  zip: ACME_ZIP,
  address: ACME_ADDRESS,
  website: ACME_WEBSITE,
  description: ACME_DESCRIPTION,
  phone: ACME_PHONE,
  city: ACME_CITY,
  businessType: ACME_BUSINESS_TYPE,
  verified: true,
  insightId: ACME_INSIGHT_ID,
  createdAt: FIRST_JAN_2020_STRING,
  accountManagerEmail: JOE_BLOGGS_EMAIL,
  businessPricingSegment: ACME_BUSINESS_SEGMENT,
  crmInternalFlag: ACME_CRM_INTERNAL_FLAG,
};
export const FAKE_PRICE = 10.8;
export const FAKE_PRICE_UNIT = 'Mbps';
export const FAKE_PRICE_OBJECT: CamundaVariable = {
  type: 'Double',
  value: 10.8,
  valueInfo: {},
};
export const FAKE_STATUS = 'Completed';
export const FAKE_ATTRIBUTES: AttributeRecord = { businessType: 'ENTERPRISE' };
export const FAKE_VARIABLES: CamundaVariables = {
  businessType: { type: 'String', value: 'ENTERPRISE', valueInfo: {} },
};
export const FAKE_PRICE_RESPONSE: CamundaVariables = {
  monthlyRecurringCost: { ...FAKE_PRICE_OBJECT },
  nonRecurringCost: { ...FAKE_PRICE_OBJECT },
  totalContractValue: { ...FAKE_PRICE_OBJECT },
};
export const FAKE_SUBSCRIPTION_RESPONSE = {
  message: 'SUCCESS',
  subscriptionId: FAKE_OBJECT_ID,
};

export const FAKE_SUBSCRIPTION_REQUEST = {
  bp_account_id: 'ACCOUNT01',
  bp_billing_profile_uuid: FAKE_UUID_V1,
  contract_start_date: FAKE_CONTRACT_START_DATE,
  contract_end_date: FAKE_CONTRACT_END_DATE,
  past_contract_end_date: '2023-11-22',
  contract_termination_date: '2024-01-01',
};

export const FAKE_ORDER_ATTRIBUTES = {
  sku: 'compute-regular',
  duration: '12m',
  region: '',
  bandwidth: 10,
  durationUnit: 'm',
  sourcePortId: '5d115df35b07b1000aefab94',
  classOfService: 'SILVER',
  pricingSegment: 'Wholesale',
  destinationPortId: '',
};

export const FAKE_USER_TASK_VARIABLES = {
  orderId: FAKE_UUID,
  companyId: FAKE_UUID,
  productOfferingId: FAKE_UUID,
  customerReference: 'customer-reference',
};

export const FAKE_COMMON_VALUE = '10';
export const FAKE_CURRENCY_CODE = 'AUD';
export const FAKE_CUSTOMER_SERVICE_REFERENCE = 'CSRV12345678';
export const FAKE_ATTRIBUTE_NAME = 'a_end_country';
export const FAKE_ATTRIBUTE_VALUE = 'GBR';
export const FAKE_ORDERING_ENTITY_ID = 'price';
export const FAKE_SUBSCRIPTION_STATUS_SUCCESS = 'SUCCESS';
export const FAKE_COMPANY_NAME = 'PCCW Global IoT';
export const FAKE_ORDER_NAME = 'Order 1';
export const FAKE_PRODUCT_NAME = 'Vultr Cloud Bare Metal';
export const FAKE_MAPPING_ATTRIBUTE_NAME = 'city';
export const FAKE_MAPPING_ATTRIBUTE_VALUE = 'city';

export const FAKE_SUBSCRIPTION_PRODUCT_MAPPING_RESPONSE = {
  ccBaseProductOfferingId: '6ab3a1fd-5e0b-427c-8929-367fc58c73b8',
  subscriptionProductMappingId: '102b917c-806d-496f-a2bc-ccdbdcf7f300',
  ccProductOfferingId: '6ab3a1fd-5e0b-427c-8929-367fc58c73b8',
  ccProductSpecificationId: 'a58fd2d8-e462-4969-a51f-5db7572bb566',
  bpProductPackageId: '12345',
  bpPackageId: '345',
  bpProductId: 'a58fd2d8-e462-6534-a51f-5db7572bb765',
  productName: FAKE_PRODUCT_NAME,
  orderId: '4620866c-de2e-4f0b-8875-6fa3836e5760',
};

export const FAKE_PRODUCT_OFFERING_ID = '9d242977-e24f-4e26-8ffd-501e87583566';
export const FAKE_PRODUCT_OFFERING_NAME = FAKE_PRODUCT_NAME;
export const FAKE_RATING_METHOD = 'Subscription';
export const FAKE_HANDLER = 'GET_DCF_DETAILS_BY_ID';
export const FAKE_KEY = 'destLocation';
export const FAKE_RATE = '370';

export const FAKE_BILLING_REQUEST = {
  bp_account_id: 'ACCOUNT01',
  bp_billing_profile_uuid: FAKE_UUID_V1,
  name: 'ABC.COM SRL - 010 - USD',
  companyId: '026',
  crm_customer_id: 'GOL037',
  invoice_at_this_level: true,
  allow_pricing_in_different_currency: false,
  rate_hierarchy: false,
  invoice_currency: 'USD',
  address: 'Via V. Monti 2, 20123 Milan',
  attention: 'Finance',
  bill_to: 'ABC.COM SRL',
  billing_cycle: 'MONTHLY',
  manual_closing: false,
  city: 'Milan',
  country: 'ITA',
  bill_contact_email: 'example@example.com',
  bill_contact_phone: '+393929311118',
  bill_contact_fax: '+390249535014',
  invoice_delivery_method: 'EMAIL',
  payment_method_text: '63',
  payment_method: '1',
  payment_term_days: '30',
  zip_code: '510001',
  sales_contact_email: 'abc@pccwglobal.com',
  sales_contact_name: 'Sales contact ABC',
  separate_service_invoice: false,
  is_default: false,
  pccw_epi_comp_code: '010',
  pccw_epi_comp_id: '010', //comp_code renamed as comp Id
  invoice_timezone: 'UTC',
  our_contract_email: 'fin@pccwglobal.com',
  account_type: 'Billing Account',
};

export const FAKE_BILLING_ACCOUNT_RESPONSE = {
  message: 'Success',
  id: 'ACCOUNT01',
};

export const COMPANY_ID = '5aa8ac8f88b6de00124da03a';
export const FAKE_NUMBER = 3;
export const COMPANY = {
  name: 'PCCW Global Limited',
  branch: 'French Branch',
};

export const FAKE_PRODUCT_SPEC_DELIVERY_TIME = {
  unit: 'd',
  duration: 2,
};

export const FAKE_COMPANY_DETAILS = {
  id: FAKE_UUID,
  insight_signed_company_id: FAKE_NUMBER,
  billing_entity: 'PCCW Global Limited',
  branch: 'French Branch',
  pccw_epi_comp_id: '010',
  region: 'Hong Kong',
  eligible_for_online: true,
  default_billing_entity: true,
  default_billing_region: true,
};

export const FAKE_CRM_USER: CRMUser = {
  email: JOE_BLOGGS_EMAIL,
  firstName: JOE_BLOGGS_FIRSTNAME,
  jobTitle: JOE_BLOGGS_HEADLINE, // Using headline for job title
  lastName: JOE_BLOGGS_LASTNAME,
  phone: JOE_BLOGGS_PHONE,
  subscribeToMarketingUpdates: true, // Equivalent to optIntoMarketingEmail
};

export const CRM_INSIGHT = 'INSIGHT';

export const FAKE_INSIGHT_REQUEST = {
  id: FAKE_UUID,
  orderId: '4620866c-de2e-4f0b-8875-6fa3836e5760',
  salesRecordId: '026',
  serviceOrderId: '037',
  insightRatingMethodDetails: [
    { ratingMethod: 'Subscription', rate: '370' },
    { ratingMethod: 'One Time Charge', rate: '200' },
    { ratingMethod: 'Usage', rate: '100' },
  ],
  contractStartDate: FAKE_ISO8601_DATE,
  contractEndDate: '2023-01-11',
  createdAt: FAKE_ISO8601_DATE,
  updatedAt: '2023-01-03',
  deletedAt: '2023-01-09',
};

export const FAKE_INSIGHT_RESPONSE = {
  message: 'Success',
};

export const FAKE_ASN = 60556;
export const FAKE_ASN_LEGACY = '60556';
export const FAKE_AS_SET = 'AS-CAIS';
export const FAKE_IP_V4_PREFIX = '10.1.1.0/24';
export const FAKE_IP_V4_ADDRESS = '10.1.1.1';
export const FAKE_IP_V6_PREFIX = '2400:8800::/32';
export const FAKE_IP_V6_ADDRESS = '2400:8800::';

export const FAKE_TERMINATE_SUBSCRIPTION_REQUEST = {
  termination_date: '2024-12-31',
  termination_reason: 'Contract End',
  early_terminated_waived: false,
  orderId: FAKE_UUID,
  subscriptionId: FAKE_OBJECT_ID,
  companyId: FAKE_OBJECT_ID,
};

export const FAKE_DEEP_SEARCH_MANUAL_SYNC_FLAG = true;

export const FAKE_SUBSCRIPTION_PRODUCT = {
  rate: FAKE_PRICE,
  productOfferingId: FAKE_UUID,
  productOfferingName: 'Vultr Cloud Bare Metal',
};

export const FAKE_SUBSCRIPTION_PRODUCT_CHARGES = {
  ratingMethod: FAKE_RATING_METHOD,
  totalAmount: FAKE_PRICE,
  products: [FAKE_SUBSCRIPTION_PRODUCT],
};

export const FAKE_SUBSCRIPTION_PRODUCT_DETAILS_RESPONSE = {
  bpSubscriptionId: FAKE_OBJECT_ID,
  billingAccountId: '62a02730407271eeb4f86463',
  productOfferingId: '62a02730407271eeb4f86463',
  isActive: false,
  contractStartDate: FAKE_CONTRACT_START_DATE,
  contractEndDate: FAKE_CONTRACT_END_DATE,
  serviceId: '62a02730407271eeb4f86463',
  orderId: '62a02730407271eeb4f86463',
  charges: [FAKE_SUBSCRIPTION_PRODUCT_CHARGES],
};

export const FAKE_BP_BILLING_WALLET_PROFILE_ID = '92449';
export const FAKE_BP_BILLING_WALLET_CARD_ID = '32277';

export const FAKE_BP_BILLING_PROFILE_RESPONSE = [
  {
    id: '98879',
  },
];

export const FAKE_BP_BILLING_WALLET_RESPONSE = {
  retrieveResponse: [
    {
      billingProfileId: FAKE_BP_BILLING_WALLET_PROFILE_ID,
      id: FAKE_BP_BILLING_WALLET_CARD_ID,
      status: 'ACTIVE',
    },
    {
      id: FAKE_BP_BILLING_WALLET_CARD_ID,
      status: 'ACTIVE',
      billingProfileId: FAKE_BP_BILLING_WALLET_PROFILE_ID,
      defaultFlag: '0',
      hostedPaymentPageExternalId: FAKE_UUID,
    },
  ],
};

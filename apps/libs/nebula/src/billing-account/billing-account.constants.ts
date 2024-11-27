import HttpStatusCodes from 'http-status-codes';

export const REST_BILLING_ACCOUNT_PREFIX = 'admin';
export const REST_CREATE_BILLING_ACCOUNT = 'billing-accounts';
export const REST_VALIDATE_BILLING_ACCOUNT =
  'company/:companyId/billing-accounts/validate';
export const REST_GET_BILLING_ACCOUNT = '/billing-accounts/:id';
export const REST_LIST_BILLING_ACCOUNT = 'billing-accounts';
export const REST_GET_LIST_COMPANIES = '/billing-accounts/companies';
export const REST_UPDATE_COMPANY = 'company/:pccwEpiCompId';
export const REST_DELETE_COMPANY = 'company/:pccwEpiCompId';
export const REST_PATCH_BILLING_ACCOUNT = '/billing-accounts/:id';
export const REST_CREATE_COMPANY = 'company';
export const REST_GET_HPP_TOKEN = '/billing-accounts/hosted-payment-page/token';
export const REST_SET_DEFAULT_BILLING_ACCOUNT =
  '/billing-accounts/:id/set-default';
export const REST_PATCH_BILLING_ACCOUNT_PAYMENT_METHOD =
  '/billing-accounts/payment-method';
export const REST_VALIDATE_BILLING_ACCOUNT_FOR_ORDERING =
  '/companies/:companyId/billing-accounts/validate-for-ordering';

export enum BILLING_ACCOUNT_STATUS {
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS',
  TIMEOUT = 'TIMEOUT',
}

export enum BILLING_ACCOUNT_PAYMENT_METHOD {
  AUTOPAY = '0',
  MANUAL = '1',
}

export const SUCCESS_MESSAGE = `Success`;
export const VALID_BILLING_ACCOUNT_AVAILABLE = `One or more billing accounts is eligible for Console Connect ordering`;
export const VALID_BILLING_ACCOUNT_NOT_AVAILABLE = `No billing account is eligible for Console Connect ordering`;
export const BILLING_ACCOUNT_NOT_AVAILABLE = `No billing account found`;

export const SHIELD_CURRENCY = 'USD';
export const CRM_INSIGHT = 'INSIGHT';
export const LENGTH_24 = 24;
export const BILLING_ACCOUNT_ID_MIN_LENGTH = 2;
export const BILLING_ACCOUNT_ID_MAX_LENGTH = 10;

export type UnmatchedField =
  | 'insightId'
  | 'currency'
  | 'billingEntityId'
  | 'approved';

export const SORT_OPTIONS = ['ASC', 'DESC', 'asc', 'desc'];

// Billing Account Default Fields
export const PAYMENT_METHOD_TEXT = `By TELEGRAPHIC TRANSFER\n========================\nPlease quote your COMPANY NAME and INVOICE NO. to your Remitting bank.\n\nBeneficiary Name :  PCCW Global Limited\nBank Name           :  The Hongkong and Shanghai Banking Corporation Ltd\nBank Address       :  1 Queen's Road, Central, Hong Kong\nBank Swift Code   :  HSBCHKHH\nBank Account No. :  502-017064-274  &amp;lt;USD&gt;\n                                 502-017064-001  &amp;lt;HKD&gt;\n                                 502-017064-275  &amp;lt;EUR&gt;\n                                 502-017064-276  &amp;lt;GBP&gt;`;
export const INVOICE_TIMEZONE = 'UTC';
export const ACCOUNT_TYPE = 'BILLING ACCOUNT';

export const BILLING_ACCOUNT_ERROR_KEYS = Object.freeze({
  [HttpStatusCodes.NOT_FOUND]: 'NoBillingAccountFound',
  [HttpStatusCodes.BAD_REQUEST]: 'InvalidRequestBody',
  [HttpStatusCodes.FORBIDDEN]: 'PermissionDenied',
  [HttpStatusCodes.UNAUTHORIZED]: 'Unauthorized',
  [HttpStatusCodes.GATEWAY_TIMEOUT]: 'GatewayTimeout',
  [HttpStatusCodes.UNPROCESSABLE_ENTITY]: 'InvalidCRMIds',
});

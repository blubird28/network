import { isString } from 'lodash';

import { CommonErrorCodes } from './common.error.codes';
import { IdentityErrorCodes } from './identity.error.codes';
import { PricingErrorCodes } from './pricing.error.codes';
import { SubscriptionErrorCodes } from './subscription.error.codes';
import { NotificationErrorCodes } from './notification.error.codes';
import { BillingAccountErrorCodes } from './billing_account.error.codes';
import { CRMSyncErrorCodes } from './crm-sync.error.codes';
import { NetworkErrorCodes } from './network.error.codes';
import { SearchErrorCodes } from './search.error.codes';

export const ErrorCode = {
  ...CommonErrorCodes,
  ...IdentityErrorCodes,
  ...PricingErrorCodes,
  ...SubscriptionErrorCodes,
  ...NotificationErrorCodes,
  ...BillingAccountErrorCodes,
  ...CRMSyncErrorCodes,
  ...NetworkErrorCodes,
  ...SearchErrorCodes,
};
export type ErrorCode =
  | CommonErrorCodes
  | IdentityErrorCodes
  | PricingErrorCodes
  | SubscriptionErrorCodes
  | NotificationErrorCodes
  | BillingAccountErrorCodes
  | CRMSyncErrorCodes
  | NetworkErrorCodes
  | SearchErrorCodes;

export type ErrorKey = keyof typeof ErrorCode;

const errorCodes: ErrorCode[] = Object.values(ErrorCode);

export const isErrorCode = (test: unknown): test is ErrorCode =>
  isString(test) && errorCodes.includes(test as ErrorCode);

export const DEFAULT_ERROR_CODE = ErrorCode.Unknown;

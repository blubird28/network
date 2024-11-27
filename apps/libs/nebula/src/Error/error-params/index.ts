import { ErrorKey } from '../constants';

import { CRMSyncErrorParams } from './crm-sync.error.params';
import { CommonErrorParams } from './common.error.params';
import { PricingErrorParams } from './pricing.error.params';
import { IdentityErrorParams } from './identity.error.params';
import { SubscriptionErrorParams } from './subscription.error.params';
import { NotificationErrorParams } from './notification.error.params';
import { BillingAccountErrorParams } from './billing_account.error.params';
import { NetworkErrorParams } from './network.error.params';
import { SearchErrorParams } from './search.error.params';

const mergedErrorParams = new Map<ErrorKey, number>();
const errorParams = [
  CommonErrorParams,
  IdentityErrorParams,
  PricingErrorParams,
  SubscriptionErrorParams,
  NotificationErrorParams,
  BillingAccountErrorParams,
  CRMSyncErrorParams,
  NetworkErrorParams,
  SearchErrorParams,
];

errorParams.forEach((map) => {
  map.forEach((value, key) => {
    mergedErrorParams.set(key, value);
  });
});

export const ErrorParams = mergedErrorParams;

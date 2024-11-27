export const REST_BP_PREFIX = 'billingplatform';
export const REST_BP_SUBSCRIPTION_PATH = '/subscriptions';
export const REST_BP_GET_SUBSCRIPTION_BY_ID = '/:id';
export const REST_BP_BILLING_ACCOUNT_PATH = '/billing-accounts';
export const REST_GET_BP_BILLING_ACCOUNT_PATH = '/billing-accounts/:id';
export const REST_BP_AUTH_PATH = '/oauth/token';
export const REST_BP_TERMINATE_SUBSCRIPTION_PATH = '/terminate';

export interface TokenRequestBody {
  system_id: string;
  client_id: string;
  client_secret: string;
  grant_type: string;
  audience: string;
}

export interface TokenData {
  access_token: string;
  expires_in: number;
}

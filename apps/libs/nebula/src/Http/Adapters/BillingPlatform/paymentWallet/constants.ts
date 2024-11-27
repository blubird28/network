export const REST_BILLING_PLATFORM_AUTH_PATH = 'auth/1.0/authenticate';
export const REST_BILLING_PLATFORM_PATH = '/rest/2.0';
export const REST_BILLING_PLATFORM_QUERY_PATH = '/query';
export const REST_BILLING_PLATFORM_WALLET_PATH = '/wallet';

export interface PaymentWalletTokenResponseData {
  access_token: string;
  expires_in: number;
}

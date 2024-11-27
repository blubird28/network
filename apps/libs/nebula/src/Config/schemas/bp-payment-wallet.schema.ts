import * as Joi from 'joi';

export interface BpPaymentWalletConfig {
  BILLING_PLATFORM_URL: string;
  BILLING_PLATFORM_AUTH_CLIENT_ID: string;
  BILLING_PLATFORM_AUTH_CLIENT_SECRET: string;
  BILLING_PLATFORM_AUTH_GRANT_TYPE: string;
}

export const BpPaymentWalletSchema = Joi.object<BpPaymentWalletConfig>({
  BILLING_PLATFORM_URL: Joi.string().uri().required(),
  BILLING_PLATFORM_AUTH_CLIENT_ID: Joi.string().required(),
  BILLING_PLATFORM_AUTH_CLIENT_SECRET: Joi.string().required(),
  BILLING_PLATFORM_AUTH_GRANT_TYPE: Joi.string().required(),
}).required();

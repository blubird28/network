import * as Joi from 'joi';

export interface BillingPlatformConfig {
  BP_BASE_URL: string;
  BP_BASE_PATH: string;
  BP_AUTH_URL: string;
  BP_AUTH_SYSTEM_ID: string;
  BP_AUTH_CLIENT_ID: string;
  BP_AUTH_CLIENT_SECRET: string;
  BP_AUTH_GRANT_TYPE: string;
  BP_AUTH_AUDIENCE: string;
}

export const BillingPlatformSchema = Joi.object<BillingPlatformConfig>({
  BP_BASE_URL: Joi.string().required(),
  BP_BASE_PATH: Joi.string().required(),
  BP_AUTH_URL: Joi.string().uri().required(),
  BP_AUTH_SYSTEM_ID: Joi.string().required(),
  BP_AUTH_CLIENT_ID: Joi.string().required(),
  BP_AUTH_CLIENT_SECRET: Joi.string().required(),
  BP_AUTH_GRANT_TYPE: Joi.string().required(),
  BP_AUTH_AUDIENCE: Joi.string().required(),
}).required();

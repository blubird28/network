import * as Joi from 'joi';

export interface BpHostedPaymentsPageConfig {
  BP_HPP_BASE_URL: string;
  BP_HPP_ENV_ID: string;
  BP_HPP_CLIENT_ID: string;
  BP_HPP_CLIENT_SECRET: string;
}

export const BpHostedPaymentsPageSchema =
  Joi.object<BpHostedPaymentsPageConfig>({
    BP_HPP_BASE_URL: Joi.string().uri().required(),
    BP_HPP_ENV_ID: Joi.string().required(),
    BP_HPP_CLIENT_ID: Joi.string().required(),
    BP_HPP_CLIENT_SECRET: Joi.string().required(),
  }).required();

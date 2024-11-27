import * as Joi from 'joi';

import { DEFAULT_SENDGRID_TEMPLATE_CACHE_TTL } from '../config.constants';

export interface SendGridConfig {
  SENDGRID_API_KEY: string;
  SENDGRID_TEMPLATE_CACHE_TTL: number;
}

export const sendGridConfig = Joi.object<SendGridConfig>({
  SENDGRID_API_KEY: Joi.string().required(),
  SENDGRID_TEMPLATE_CACHE_TTL: Joi.number().default(
    DEFAULT_SENDGRID_TEMPLATE_CACHE_TTL,
  ),
}).required();

import * as Joi from 'joi';

export interface BullConnectionConfig {
  BULL_REDIS_HOST: string;
  BULL_REDIS_PORT: number;
  BULL_REDIS_PASSWORD?: string;
  BULL_REDIS_CA_CERT_PATH?: string;
}

export const bullConnectionSchema = Joi.object<BullConnectionConfig>({
  BULL_REDIS_HOST: Joi.string().hostname().required(),
  BULL_REDIS_PORT: Joi.number().positive().integer().required(),
  BULL_REDIS_PASSWORD: Joi.string(),
  BULL_REDIS_CA_CERT_PATH: Joi.string(),
}).required();

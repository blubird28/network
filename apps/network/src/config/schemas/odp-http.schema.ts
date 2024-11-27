import * as Joi from 'joi';

export interface OdpHttpConfig {
  ODP_API_BASE_URL: string;
  ODP_API_CLIENT_KEY: string;
  ODP_API_CLIENT_SECRET: string;
}

export const odpHttpSchema = Joi.object<OdpHttpConfig>({
  ODP_API_BASE_URL: Joi.string().uri().required(),
  ODP_API_CLIENT_KEY: Joi.string().required(),
  ODP_API_CLIENT_SECRET: Joi.string().required(),
}).required();

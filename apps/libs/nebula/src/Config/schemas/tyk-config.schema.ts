import * as Joi from 'joi';

export interface TykConfig {
  TYK_ENABLED: string;
  TYK_API_ID: string;
  TYK_DASHBOARD_API_URL: string;
  TYK_DASHBOARD_API_TOKEN: string;
}

export const tykConfigSchema = Joi.object<TykConfig>({
  TYK_ENABLED: Joi.boolean().required(),
  TYK_API_ID: Joi.string().required(),
  TYK_DASHBOARD_API_URL: Joi.string().uri().required(),
  TYK_DASHBOARD_API_TOKEN: Joi.string().required(),
});

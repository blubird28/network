import * as Joi from 'joi';

export interface ShieldApiConfig {
  SHIELD_API_URL: string;
}

export const shieldApiSchema = Joi.object<ShieldApiConfig>({
  SHIELD_API_URL: Joi.string().uri().required(),
}).required();

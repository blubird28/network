import * as Joi from 'joi';

export interface ShieldAppConfig {
  SHIELD_APP_URL: string;
}

export const shieldAppSchema = Joi.object<ShieldAppConfig>({
  SHIELD_APP_URL: Joi.string().uri().required(),
}).required();

import * as Joi from 'joi';

export interface LegacySuperUserTokenConfig {
  LEGACY_SUPERUSER_TOKEN: string;
}

export const legacySuperUserTokenSchema =
  Joi.object<LegacySuperUserTokenConfig>({
    LEGACY_SUPERUSER_TOKEN: Joi.string().required(),
  }).required();

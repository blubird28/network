import * as Joi from 'joi';

import { JWTAlgorithm } from './jwt.schema';

interface ShieldJWTConfigBase {
  SHIELD_JWT_AUDIENCE: string;
  SHIELD_JWT_ISSUER: string;
  SHIELD_JWT_ALGORITHM: JWTAlgorithm;
  SHIELD_JWT_JWKS_ENABLED: boolean;
  SHIELD_JWT_SECRET?: string;
  SHIELD_JWT_LDAPID_PARAM: string;
}

interface ShieldJWTConfigJWKS extends ShieldJWTConfigBase {
  SHIELD_JWT_JWKS_ENABLED: true;
}
interface ShieldJWTConfigStatic extends ShieldJWTConfigBase {
  SHIELD_JWT_JWKS_ENABLED: false;
  SHIELD_JWT_SECRET: string;
}

export type ShieldJWTConfig = ShieldJWTConfigStatic | ShieldJWTConfigJWKS;

export const shieldJwtSchema = Joi.object<ShieldJWTConfig>({
  SHIELD_JWT_LDAPID_PARAM: Joi.string().required(),
  SHIELD_JWT_AUDIENCE: Joi.string().required(),
  SHIELD_JWT_ISSUER: Joi.string().uri().required(),
  SHIELD_JWT_ALGORITHM: Joi.string().valid('RS256', 'HS256').required(),
  SHIELD_JWT_JWKS_ENABLED: Joi.boolean().truthy('1').falsy('0').default(true),
  SHIELD_JWT_SECRET: Joi.string().when('SHIELD_JWT_JWKS_ENABLED', {
    is: true,
    then: Joi.forbidden(),
    otherwise: Joi.required(),
  }),
}).required();

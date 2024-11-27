import * as Joi from 'joi';

export type JWTAlgorithm = 'RS256' | 'HS256';

interface JWTConfigBase {
  JWT_AUDIENCE: string;
  JWT_ISSUER: string;
  JWT_ALGORITHM: JWTAlgorithm;
  JWT_JWKS_ENABLED: boolean;
  JWT_SECRET?: string;
}

interface JWTConfigJWKS extends JWTConfigBase {
  JWT_JWKS_ENABLED: true;
}
interface JWTConfigStatic extends JWTConfigBase {
  JWT_JWKS_ENABLED: false;
  JWT_SECRET: string;
}

export type JWTConfig = JWTConfigStatic | JWTConfigJWKS;

export const jwtSchema = Joi.object<JWTConfig>({
  JWT_AUDIENCE: Joi.string().uri().required(),
  JWT_ISSUER: Joi.string().uri().required(),
  JWT_ALGORITHM: Joi.string().valid('RS256', 'HS256').required(),
  JWT_JWKS_ENABLED: Joi.boolean().truthy('1').falsy('0').default(true),
  JWT_SECRET: Joi.string().when('JWT_JWKS_ENABLED', {
    is: true,
    then: Joi.forbidden(),
    otherwise: Joi.required(),
  }),
}).required();

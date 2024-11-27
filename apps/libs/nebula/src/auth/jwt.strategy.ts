import { ExtractJwt, Strategy } from 'passport-jwt';
import { passportJwtSecret, SecretCallback } from 'jwks-rsa';

import { Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import {
  PrincipalQueryDto,
  UnauthenticatedPrincipalQueryDto,
} from '../dto/principal-query.dto';
import { JWTAlgorithm } from '../Config/schemas/jwt.schema';
import { urlJoin } from '../utils/data/urlJoin';

const createStaticSecretProvider =
  (secret: string): SecretCallback =>
  (ignored, ignoredAlso, done) =>
    done(null, secret);

export interface JwtStrategyOptions {
  secret: string;
  jwks: boolean;
  audience: string;
  issuer: string;
  algorithm: JWTAlgorithm;
}

export interface RequestUser {
  // The jwt (if any) that was validated
  payload: unknown;
  // The strategy which authenticated the user
  strategy: string;
  // The query by which to select the authenticated principal
  principalQuery: PrincipalQueryDto;
}

export const JwtStrategy = (name: string) => {
  class JwtStrategyBase extends PassportStrategy(Strategy, name) {
    readonly logger: Logger = new Logger(`JwtStrategy: ${name}`);

    constructor({
      issuer,
      jwks,
      secret,
      audience,
      algorithm,
    }: JwtStrategyOptions) {
      if (jwks === !!secret) {
        throw new Error(
          'Failed to initialize - needs either a secret or jwks enabled, but not both',
        );
      }

      const provider = secret
        ? createStaticSecretProvider(secret)
        : passportJwtSecret({
            cache: true,
            rateLimit: true,
            jwksRequestsPerMinute: 5,
            jwksUri: urlJoin(issuer, '.well-known/jwks.json'),
          });

      super({
        secretOrKeyProvider: provider,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        audience,
        issuer,
        algorithms: [algorithm],
      });

      this.logger.log(`Initializing strategy for issuer: ${issuer}`);
    }

    validate(payload: unknown): RequestUser {
      return {
        payload,
        strategy: name,
        principalQuery: new UnauthenticatedPrincipalQueryDto(),
      };
    }
  }
  return JwtStrategyBase;
};

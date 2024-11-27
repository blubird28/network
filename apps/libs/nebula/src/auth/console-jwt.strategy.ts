import { get } from 'lodash';

import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import {
  IdentityMongoIdPrincipalQueryDto,
  PrincipalQueryDto,
  UnauthenticatedPrincipalQueryDto,
} from '../dto/principal-query.dto';
import { isNonEmptyString } from '../utils/data/isNonEmptyString';
import { JWTConfig } from '../Config/schemas/jwt.schema';

import { AUTH0_SUB_PREFIX, CONSOLE_STRATEGY_NAME } from './constants';
import { JwtStrategy, RequestUser } from './jwt.strategy';

@Injectable()
export class ConsoleJwtStrategy extends JwtStrategy(CONSOLE_STRATEGY_NAME) {
  constructor(
    @Inject(ConfigService) configService: ConfigService<JWTConfig, true>,
  ) {
    const secret = configService.get('JWT_SECRET');
    const jwks = configService.get('JWT_JWKS_ENABLED');
    const audience = configService.get('JWT_AUDIENCE');
    const issuer = configService.get('JWT_ISSUER');
    const algorithm = configService.get('JWT_ALGORITHM');

    if (jwks === !!secret) {
      throw new Error(
        'Failed to initialize - needs either a JWT_SECRET or JWT_JWKS_ENABLED, but not both',
      );
    }

    super({
      algorithm,
      audience,
      issuer,
      jwks,
      secret,
    });

    if (secret) {
      this.logger.warn(
        'Initializing with static secret. Use JWT_JWKS_ENABLED=true in production environments',
      );
    }
  }

  validate(payload: unknown): RequestUser {
    return {
      ...super.validate(payload),
      principalQuery: this.getPrincipalQuery(payload),
    };
  }

  private getPrincipalQuery(jwt: unknown): PrincipalQueryDto {
    if (!jwt) {
      return new UnauthenticatedPrincipalQueryDto();
    }

    const sub: string = get(jwt, 'sub');

    if (!isNonEmptyString(sub)) {
      this.logger.error('Malformed JWT: missing or invalid sub field');
      return new UnauthenticatedPrincipalQueryDto();
    }
    const [prefix, mongoId] = sub.split('|');
    if (!prefix || !mongoId || prefix !== AUTH0_SUB_PREFIX) {
      this.logger.error('Malformed JWT: cannot parse sub field');
      return new UnauthenticatedPrincipalQueryDto();
    }
    this.logger.debug(`Got user id: ${mongoId}`);
    return new IdentityMongoIdPrincipalQueryDto(mongoId);
  }
}

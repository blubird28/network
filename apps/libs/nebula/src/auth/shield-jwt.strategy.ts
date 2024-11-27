import { get } from 'lodash';

import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ShieldJWTConfig } from '../Config/schemas/shield-jwt.schema';
import {
  AgentLdapIdPrincipalQueryDto,
  PrincipalQueryDto,
  UnauthenticatedPrincipalQueryDto,
} from '../dto/principal-query.dto';
import { isNonEmptyString } from '../utils/data/isNonEmptyString';

import { SHIELD_STRATEGY_NAME } from './constants';
import { JwtStrategy, RequestUser } from './jwt.strategy';

@Injectable()
export class ShieldJwtStrategy extends JwtStrategy(SHIELD_STRATEGY_NAME) {
  private readonly LDAP_ID_PARAM: string;
  constructor(
    @Inject(ConfigService) configService: ConfigService<ShieldJWTConfig, true>,
  ) {
    const secret = configService.get('SHIELD_JWT_SECRET');
    const jwks = configService.get('SHIELD_JWT_JWKS_ENABLED');
    const audience = configService.get('SHIELD_JWT_AUDIENCE');
    const issuer = configService.get('SHIELD_JWT_ISSUER');
    const algorithm = configService.get('SHIELD_JWT_ALGORITHM');

    if (jwks === !!secret) {
      throw new Error(
        'Failed to initialize - needs either a SHIELD_JWT_SECRET or SHIELD_JWT_JWKS_ENABLED, but not both',
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
        'Initializing with static secret. Use SHIELD_JWT_JWKS_ENABLED=true in production environments',
      );
    }

    this.LDAP_ID_PARAM = configService.get('SHIELD_JWT_LDAPID_PARAM');
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
    if (get(jwt, 'gty') === 'client-credentials') {
      this.logger.error(
        'Received a JWT with gty === client-credentials. Service accounts are not yet supported',
      );
      return new UnauthenticatedPrincipalQueryDto();
    }
    const ldapId: string = get(jwt, this.LDAP_ID_PARAM);

    if (!isNonEmptyString(ldapId)) {
      this.logger.error(
        `Received a JWT with no ldap id param (${this.LDAP_ID_PARAM})`,
      );
      return new UnauthenticatedPrincipalQueryDto();
    }

    this.logger.debug(`Got agent ldap id: ${ldapId}`);
    return new AgentLdapIdPrincipalQueryDto(ldapId);
  }
}

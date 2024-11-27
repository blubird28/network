import { Strategy } from 'passport-http-bearer';
import { get } from 'lodash';
import { ObjectId } from 'bson';

import { Inject, Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { RequestUser } from '@libs/nebula/auth/jwt.strategy';
import {
  IdentityMongoIdPrincipalQueryDto,
  PrincipalQueryDto,
  UnauthenticatedPrincipalQueryDto,
} from '@libs/nebula/dto/principal-query.dto';
import { APIKEY_STRATEGY_NAME } from '@libs/nebula/auth/constants';
import { KeyMeta, TykApiService } from '@libs/nebula/Http/Tyk/tyk-api.service';

/**
 * Gets the user ID from the provided key meta, throwing an error if it is missing or invalid.
 * This helps to prevent consuming misconfigured API keys.
 *
 * @param meta The key meta object.
 * @returns The user ID.
 */
function getUserId(meta: KeyMeta) {
  const userId = get(meta, 'data.meta_data.userid', '');

  if (!userId || !ObjectId.isValid(userId)) {
    throw new Error(
      `The API Key is invalid. Missing valid userid in meta_data. Key Hash: ${meta.key_hash}`,
    );
  }

  return userId as string;
}

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(
  Strategy,
  APIKEY_STRATEGY_NAME,
) {
  readonly logger: Logger = new Logger('ApiKeyStrategy');
  constructor(@Inject(TykApiService) private readonly tyk: TykApiService) {
    super();
  }

  async validate(token: string): Promise<RequestUser> {
    return {
      payload: null,
      strategy: APIKEY_STRATEGY_NAME,
      principalQuery: await this.getPrincipalQuery(token),
    };
  }

  private async getPrincipalQuery(token: string): Promise<PrincipalQueryDto> {
    if (!token) {
      return new UnauthenticatedPrincipalQueryDto();
    }

    try {
      const meta = await this.tyk.getKeyMeta(token);

      const userId = getUserId(meta);
      return new IdentityMongoIdPrincipalQueryDto(userId);
    } catch (error) {
      this.logger.error('Key resolution failed', error);
      return new UnauthenticatedPrincipalQueryDto();
    }
  }
}

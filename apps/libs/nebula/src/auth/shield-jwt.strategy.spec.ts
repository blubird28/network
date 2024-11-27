import * as jwks from 'jwks-rsa';

import { Test } from '@nestjs/testing';
import * as passport from '@nestjs/passport';

import { ShieldJWTConfig } from '../Config/schemas/shield-jwt.schema';
import { faker } from '../testing/data/fakers';
import {
  AgentLdapIdPrincipalQueryDto,
  UnauthenticatedPrincipalQueryDto,
} from '../dto/principal-query.dto';
import { JOE_BLOGGS_USERNAME } from '../testing/data/constants';
import { Mocker } from '../testing/mocker/mocker';

import { ShieldJwtStrategy } from './shield-jwt.strategy';

jest.mock('jwks-rsa');
jest.mock('@nestjs/passport', () => {
  // PassportStrategy is called on file parse, not initialization, and we need to keep a reference
  // to the dynamic class it creates, so we can check it is called.
  const mocked = jest.fn();
  return {
    mocked,
    PassportStrategy: jest.fn().mockReturnValue(mocked),
  };
});

describe('Shield JWT authentication strategy', () => {
  const DEFAULTS: ShieldJWTConfig = {
    SHIELD_JWT_AUDIENCE: 'https://shield.audience.fake/',
    SHIELD_JWT_ISSUER: 'https://auth.shield.fake/',
    SHIELD_JWT_ALGORITHM: 'HS256',
    SHIELD_JWT_JWKS_ENABLED: true,
    SHIELD_JWT_LDAPID_PARAM: 'ldapId',
  };
  const unauthenticated = faker(UnauthenticatedPrincipalQueryDto);

  const keyProvider = jest.fn((ignored, ignoredAlso, done) =>
    done('superPublicKey'),
  );
  const setup = async (config: Partial<ShieldJWTConfig> = DEFAULTS) => {
    const module = await Test.createTestingModule({
      providers: [ShieldJwtStrategy],
    })
      .useMocker(Mocker.config<ShieldJWTConfig>({ ...DEFAULTS, ...config }))
      .compile();

    return module.get(ShieldJwtStrategy);
  };

  beforeEach(() => {
    jest.resetAllMocks();
    jest.spyOn(jwks, 'passportJwtSecret').mockReturnValue(keyProvider);
  });

  it('initializes with a static secret', async () => {
    await setup({
      SHIELD_JWT_SECRET: 'superSecretKey',
      SHIELD_JWT_JWKS_ENABLED: false,
    });
    expect(jwks.passportJwtSecret).not.toBeCalled();
    expect(passport['mocked']).toBeCalledWith({
      algorithms: [DEFAULTS.SHIELD_JWT_ALGORITHM],
      audience: DEFAULTS.SHIELD_JWT_AUDIENCE,
      issuer: DEFAULTS.SHIELD_JWT_ISSUER,
      jwtFromRequest: expect.any(Function),
      secretOrKeyProvider: expect.any(Function),
    });
    expect(
      await new Promise((resolve, reject) => {
        passport['mocked'].mock.calls[0][0].secretOrKeyProvider(
          null,
          null,
          (err, r) => {
            err ? reject(err) : resolve(r);
          },
        );
      }),
    ).toBe('superSecretKey');
  });
  it('initializes with jwks', async () => {
    await setup();
    expect(jwks.passportJwtSecret).toBeCalledWith({
      cache: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `${DEFAULTS.SHIELD_JWT_ISSUER}.well-known/jwks.json`,
      rateLimit: true,
    });
    expect(passport['mocked']).toBeCalledWith({
      algorithms: [DEFAULTS.SHIELD_JWT_ALGORITHM],
      audience: DEFAULTS.SHIELD_JWT_AUDIENCE,
      issuer: DEFAULTS.SHIELD_JWT_ISSUER,
      jwtFromRequest: expect.any(Function),
      secretOrKeyProvider: expect.any(Function),
    });
    expect(passport['mocked'].mock.calls[0][0].secretOrKeyProvider).toBe(
      keyProvider,
    );
  });
  it('throws for invalid configuration', async () => {
    await expect(
      setup({ SHIELD_JWT_SECRET: 'superSecretKey' }),
    ).rejects.toThrow(
      'Failed to initialize - needs either a SHIELD_JWT_SECRET or SHIELD_JWT_JWKS_ENABLED, but not both',
    );
    await expect(setup({ SHIELD_JWT_JWKS_ENABLED: false })).rejects.toThrow(
      'Failed to initialize - needs either a SHIELD_JWT_SECRET or SHIELD_JWT_JWKS_ENABLED, but not both',
    );
  });

  it('resolves to unauthenticated if the jwt is missing', async () => {
    const service = await setup();

    expect(service.validate(null).principalQuery).toStrictEqual(
      unauthenticated,
    );
  });

  it('resolves to unauthenticated if the jwt has no ldap id field', async () => {
    const service = await setup();

    expect(service.validate({}).principalQuery).toStrictEqual(unauthenticated);
  });

  it('resolves to unauthenticated if the jwt has gty === client-credentials', async () => {
    const service = await setup();

    expect(
      service.validate({ gty: 'client-credentials' }).principalQuery,
    ).toStrictEqual(unauthenticated);
  });

  it('resolves to unauthenticated if the jwt has an invalid ldap id field', async () => {
    const service = await setup();

    expect(service.validate({ ldapId: '' }).principalQuery).toStrictEqual(
      unauthenticated,
    );
    expect(service.validate({ ldapId: {} }).principalQuery).toStrictEqual(
      unauthenticated,
    );
  });

  it('resolves to a shield agent by ldap ID if the jwt has a valid ldap id field', async () => {
    const service = await setup();

    expect(
      service.validate({ ldapId: JOE_BLOGGS_USERNAME }).principalQuery,
    ).toStrictEqual(faker(AgentLdapIdPrincipalQueryDto));
  });
});

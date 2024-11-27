import * as jwks from 'jwks-rsa';

import { Test } from '@nestjs/testing';
import * as passport from '@nestjs/passport';

import {
  IdentityMongoIdPrincipalQueryDto,
  UnauthenticatedPrincipalQueryDto,
} from '../dto/principal-query.dto';
import { faker } from '../testing/data/fakers';
import { FAKE_OBJECT_ID } from '../testing/data/constants';
import { JWTConfig } from '../Config/schemas/jwt.schema';
import { Mocker } from '../testing/mocker/mocker';

import { AUTH0_SUB_PREFIX } from './constants';
import { ConsoleJwtStrategy } from './console-jwt.strategy';

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

describe('Console JWT authentication strategy', () => {
  const DEFAULTS: JWTConfig = {
    JWT_AUDIENCE: 'https://constellation.audience.fake/',
    JWT_ISSUER: 'https://auth.constellation.fake/',
    JWT_ALGORITHM: 'HS256',
    JWT_JWKS_ENABLED: true,
  };
  const unauthenticated = faker(UnauthenticatedPrincipalQueryDto);
  const identityUser = faker(IdentityMongoIdPrincipalQueryDto);
  const keyProvider = jest.fn((ignored, ignoredAlso, done) =>
    done('superPublicKey'),
  );
  const setup = async (config: Partial<JWTConfig> = DEFAULTS) => {
    const module = await Test.createTestingModule({
      providers: [ConsoleJwtStrategy],
    })
      .useMocker(Mocker.config<JWTConfig>({ ...DEFAULTS, ...config }))
      .compile();

    return module.get(ConsoleJwtStrategy);
  };

  beforeEach(() => {
    jest.resetAllMocks();
    jest.spyOn(jwks, 'passportJwtSecret').mockReturnValue(keyProvider);
  });

  it('initializes with a static secret', async () => {
    await setup({ JWT_SECRET: 'superSecretKey', JWT_JWKS_ENABLED: false });
    expect(jwks.passportJwtSecret).not.toBeCalled();
    expect(passport['mocked']).toBeCalledWith({
      algorithms: [DEFAULTS.JWT_ALGORITHM],
      audience: DEFAULTS.JWT_AUDIENCE,
      issuer: DEFAULTS.JWT_ISSUER,
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
      jwksUri: `${DEFAULTS.JWT_ISSUER}.well-known/jwks.json`,
      rateLimit: true,
    });
    expect(passport['mocked']).toBeCalledWith({
      algorithms: [DEFAULTS.JWT_ALGORITHM],
      audience: DEFAULTS.JWT_AUDIENCE,
      issuer: DEFAULTS.JWT_ISSUER,
      jwtFromRequest: expect.any(Function),
      secretOrKeyProvider: expect.any(Function),
    });
    expect(passport['mocked'].mock.calls[0][0].secretOrKeyProvider).toBe(
      keyProvider,
    );
  });
  it('throws for invalid configuration', async () => {
    await expect(setup({ JWT_SECRET: 'superSecretKey' })).rejects.toThrow(
      'Failed to initialize - needs either a JWT_SECRET or JWT_JWKS_ENABLED, but not both',
    );
    await expect(setup({ JWT_JWKS_ENABLED: false })).rejects.toThrow(
      'Failed to initialize - needs either a JWT_SECRET or JWT_JWKS_ENABLED, but not both',
    );
  });

  it('resolves to unauthenticated if the jwt is missing', async () => {
    const service = await setup();

    expect(service.validate(null).principalQuery).toStrictEqual(
      unauthenticated,
    );
  });

  it('resolves to unauthenticated if the jwt has no sub field', async () => {
    const service = await setup();

    expect(service.validate({}).principalQuery).toStrictEqual(unauthenticated);
  });

  it('resolves to unauthenticated if the jwt has a malformed sub field', async () => {
    const service = await setup();

    [
      `wrong-prefix|${FAKE_OBJECT_ID}`,
      `|${FAKE_OBJECT_ID}`,
      FAKE_OBJECT_ID,
      '|',
      `${AUTH0_SUB_PREFIX}|`,
      '',
    ].forEach((sub) => {
      expect(service.validate({ sub }).principalQuery).toStrictEqual(
        unauthenticated,
      );
    });
  });

  it('resolves to an identity mongoid query if the jwt has a valid sub field', async () => {
    const service = await setup();

    expect(
      service.validate({ sub: `${AUTH0_SUB_PREFIX}|${FAKE_OBJECT_ID}` })
        .principalQuery,
    ).toStrictEqual(identityUser);
  });
});

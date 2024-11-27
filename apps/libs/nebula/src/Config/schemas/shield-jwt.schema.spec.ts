import { shieldJwtSchema } from './shield-jwt.schema';

describe('config schema for shield jwt authenticated apps', () => {
  const baseConfig = {
    SHIELD_JWT_AUDIENCE: 'shield.audience.fake/',
    SHIELD_JWT_ISSUER: 'https://auth.shield.fake/',
    SHIELD_JWT_ALGORITHM: 'RS256',
    SHIELD_JWT_LDAPID_PARAM: 'https://auth.shield.fake/userId',
  };

  it('should pass for a valid config - local secret', () => {
    const result = shieldJwtSchema.validate({
      ...baseConfig,
      SHIELD_JWT_JWKS_ENABLED: 'false',
      SHIELD_JWT_SECRET: 'superSecretSauce',
    });
    expect(result.error).toBeUndefined();
  });

  it('should pass for a valid config - jwks', () => {
    const result = shieldJwtSchema.validate({
      ...baseConfig,
      SHIELD_JWT_JWKS_ENABLED: true,
    });
    expect(result.error).toBeUndefined();
  });

  it('should pass for a valid config - jwks by default', () => {
    const result = shieldJwtSchema.validate(baseConfig);
    expect(result.error).toBeUndefined();
    expect(result.value.SHIELD_JWT_JWKS_ENABLED).toBe(true);
  });
  ['SHIELD_JWT_ISSUER', 'SHIELD_JWT_ALGORITHM'].forEach((key) => {
    it(`should throw for a missing ${key}`, () => {
      const result = shieldJwtSchema.validate({
        ...baseConfig,
        [key]: undefined,
      });
      expect(result.error).toBeInstanceOf(Error);
      expect(result.error.message).toBe(`"${key}" is required`);
    });

    it(`should throw for an invalid ${key}`, () => {
      const result = shieldJwtSchema.validate({
        ...baseConfig,
        [key]: 'wrong',
      });
      expect(result.error).toBeInstanceOf(Error);
      expect(result.error.message).toMatch(`"${key}" must be `);
    });
  });

  it(`should throw for a missing SHIELD_JWT_AUDIENCE`, () => {
    const result = shieldJwtSchema.validate({
      ...baseConfig,
      SHIELD_JWT_AUDIENCE: undefined,
    });
    expect(result.error).toBeInstanceOf(Error);
    expect(result.error.message).toBe('"SHIELD_JWT_AUDIENCE" is required');
  });

  it(`should throw for a missing SHIELD_JWT_LDAPID_PARAM`, () => {
    const result = shieldJwtSchema.validate({
      ...baseConfig,
      SHIELD_JWT_LDAPID_PARAM: undefined,
    });
    expect(result.error).toBeInstanceOf(Error);
    expect(result.error.message).toBe('"SHIELD_JWT_LDAPID_PARAM" is required');
  });

  it('should throw if secret is provided and jwks is true', () => {
    const result = shieldJwtSchema.validate({
      ...baseConfig,
      SHIELD_JWT_JWKS_ENABLED: 'true',
      SHIELD_JWT_SECRET: 'superSecretSauce',
    });
    expect(result.error).toBeInstanceOf(Error);
    expect(result.error.message).toBe('"SHIELD_JWT_SECRET" is not allowed');
  });

  it('should throw if secret is provided and jwks is true by default ', () => {
    const result = shieldJwtSchema.validate({
      ...baseConfig,
      SHIELD_JWT_SECRET: 'superSecretSauce',
    });
    expect(result.error).toBeInstanceOf(Error);
    expect(result.error.message).toBe('"SHIELD_JWT_SECRET" is not allowed');
  });

  it('should throw if secret is not provided and jwks is false', () => {
    const result = shieldJwtSchema.validate({
      ...baseConfig,
      SHIELD_JWT_JWKS_ENABLED: 'false',
    });
    expect(result.error).toBeInstanceOf(Error);
    expect(result.error.message).toBe('"SHIELD_JWT_SECRET" is required');
  });
});

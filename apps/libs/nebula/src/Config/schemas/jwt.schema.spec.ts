import { jwtSchema } from './jwt.schema';

describe('config schema for jwt authenticated apps', () => {
  const baseConfig = {
    JWT_AUDIENCE: 'https://constellation.audience.fake/',
    JWT_ISSUER: 'https://auth.constellation.fake/',
    JWT_ALGORITHM: 'RS256',
  };

  it('should pass for a valid config - local secret', () => {
    const result = jwtSchema.validate({
      ...baseConfig,
      JWT_JWKS_ENABLED: 'false',
      JWT_SECRET: 'superSecretSauce',
    });
    expect(result.error).toBeUndefined();
  });

  it('should pass for a valid config - jwks', () => {
    const result = jwtSchema.validate({
      ...baseConfig,
      JWT_JWKS_ENABLED: true,
    });
    expect(result.error).toBeUndefined();
  });

  it('should pass for a valid config - jwks by default', () => {
    const result = jwtSchema.validate(baseConfig);
    expect(result.error).toBeUndefined();
    expect(result.value.JWT_JWKS_ENABLED).toBe(true);
  });

  ['JWT_AUDIENCE', 'JWT_ISSUER', 'JWT_ALGORITHM'].forEach((key) => {
    it(`should throw for a missing ${key}`, () => {
      const result = jwtSchema.validate({ ...baseConfig, [key]: undefined });
      expect(result.error).toBeInstanceOf(Error);
      expect(result.error.message).toBe(`"${key}" is required`);
    });

    it(`should throw for an invalid ${key}`, () => {
      const result = jwtSchema.validate({ ...baseConfig, [key]: 'wrong' });
      expect(result.error).toBeInstanceOf(Error);
      expect(result.error.message).toMatch(`"${key}" must be `);
    });
  });

  it('should throw if secret is provided and jwks is true', () => {
    const result = jwtSchema.validate({
      ...baseConfig,
      JWT_JWKS_ENABLED: 'true',
      JWT_SECRET: 'superSecretSauce',
    });
    expect(result.error).toBeInstanceOf(Error);
    expect(result.error.message).toBe('"JWT_SECRET" is not allowed');
  });

  it('should throw if secret is provided and jwks is true by default ', () => {
    const result = jwtSchema.validate({
      ...baseConfig,
      JWT_SECRET: 'superSecretSauce',
    });
    expect(result.error).toBeInstanceOf(Error);
    expect(result.error.message).toBe('"JWT_SECRET" is not allowed');
  });

  it('should throw if secret is not provided and jwks is false', () => {
    const result = jwtSchema.validate({
      ...baseConfig,
      JWT_JWKS_ENABLED: 'false',
    });
    expect(result.error).toBeInstanceOf(Error);
    expect(result.error.message).toBe('"JWT_SECRET" is required');
  });
});

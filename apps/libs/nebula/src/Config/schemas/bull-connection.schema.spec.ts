import { bullConnectionSchema } from './bull-connection.schema';

describe('config schema for bull redis connection', () => {
  const requiredConfig = {
    BULL_REDIS_HOST: 'localhost',
    BULL_REDIS_PORT: '3000',
  };
  const fullConfig = {
    ...requiredConfig,
    BULL_REDIS_PASSWORD: 'superSecure',
    BULL_REDIS_CA_CERT_PATH: '/path/to/cert',
  };
  it('should pass for a valid config', () => {
    const result = bullConnectionSchema.validate(fullConfig);
    expect(result.error).toBeUndefined();
  });
  it('should pass for a minimum valid config', () => {
    const result = bullConnectionSchema.validate(requiredConfig);
    expect(result.error).toBeUndefined();
  });
  Object.keys(requiredConfig).forEach((key) => {
    it(`should throw for a missing ${key}`, () => {
      const result = bullConnectionSchema.validate({
        ...fullConfig,
        [key]: undefined,
      });
      expect(result.error).toBeInstanceOf(Error);
      expect(result.error.message).toBe(`"${key}" is required`);
    });
  });
});

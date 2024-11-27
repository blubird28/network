import { BillingPlatformSchema } from './billing-platform.schema';

describe('config schema for billing platform service', () => {
  const fullConfig = {
    BP_BASE_URL: 'http://localhost:8080',
    BP_BASE_PATH: 'api',
    BP_AUTH_URL: 'http://localhost:8080',
    BP_AUTH_SYSTEM_ID: 'system_id',
    BP_AUTH_CLIENT_ID: 'client_id',
    BP_AUTH_CLIENT_SECRET: 'client_secret',
    BP_AUTH_GRANT_TYPE: 'grant_type',
    BP_AUTH_AUDIENCE: 'audience',
  };

  it('should pass for a valid config', () => {
    const result = BillingPlatformSchema.validate(fullConfig);
    expect(result.error).toBeUndefined();
  });

  Object.keys(fullConfig).forEach((key) => {
    it(`should throw for a missing ${key}`, () => {
      const result = BillingPlatformSchema.validate({
        ...fullConfig,
        [key]: undefined,
      });
      expect(result.error).toBeInstanceOf(Error);
      expect(result.error.message).toBe(`"${key}" is required`);
    });
  });
});

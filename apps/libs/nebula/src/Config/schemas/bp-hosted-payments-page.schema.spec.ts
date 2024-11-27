import { BpHostedPaymentsPageSchema } from './bp-hosted-payments-page.schema';

describe('config schema for billing platform service', () => {
  const fullConfig = {
    BP_HPP_BASE_URL: 'http://localhost:8080',
    BP_HPP_ENV_ID: 'env_id',
    BP_HPP_CLIENT_ID: 'client_id',
    BP_HPP_CLIENT_SECRET: 'client_secret',
  };

  it('should pass for a valid config', () => {
    const result = BpHostedPaymentsPageSchema.validate(fullConfig);
    expect(result.error).toBeUndefined();
  });

  Object.keys(fullConfig).forEach((key) => {
    it(`should throw for a missing ${key}`, () => {
      const result = BpHostedPaymentsPageSchema.validate({
        ...fullConfig,
        [key]: undefined,
      });
      expect(result.error).toBeInstanceOf(Error);
      expect(result.error.message).toBe(`"${key}" is required`);
    });
  });
});

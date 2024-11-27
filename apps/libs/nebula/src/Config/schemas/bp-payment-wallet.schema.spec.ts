import { BpPaymentWalletSchema } from './bp-payment-wallet.schema';

describe('config schema for wallet payment service', () => {
  const fullConfig = {
    BILLING_PLATFORM_URL: 'http://localhost:8080',
    BILLING_PLATFORM_AUTH_CLIENT_ID: 'client_id',
    BILLING_PLATFORM_AUTH_CLIENT_SECRET: 'client_secret',
    BILLING_PLATFORM_AUTH_GRANT_TYPE: 'client_credentials',
  };

  it('should pass for a valid config', () => {
    const result = BpPaymentWalletSchema.validate(fullConfig);
    expect(result.error).toBeUndefined();
  });

  Object.keys(fullConfig).forEach((key) => {
    it(`should throw for a missing ${key}`, () => {
      const result = BpPaymentWalletSchema.validate({
        ...fullConfig,
        [key]: undefined,
      });
      expect(result.error).toBeInstanceOf(Error);
      expect(result.error.message).toBe(`"${key}" is required`);
    });
  });
});

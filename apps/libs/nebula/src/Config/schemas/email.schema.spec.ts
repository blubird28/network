import { emailSchema } from './email.schema';

describe('config schema for email', () => {
  const fullConfig = {
    CONSOLE_FROM_EMAIL_NAME: 'From Console Connect',
    CONSOLE_FROM_EMAIL: 'support@example.com',
    SUPPORT_EMAIL: 'support@example.com',
  };

  it('should pass for a valid config', () => {
    const result = emailSchema.validate(fullConfig);
    expect(result.error).toBeUndefined();
  });

  it('should throw for a missing SUPPORT_EMAIL', () => {
    const result = emailSchema.validate({
      ...fullConfig,
      SUPPORT_EMAIL: undefined,
    });
    expect(result.error).toBeInstanceOf(Error);
    expect(result.error.message).toBe('"SUPPORT_EMAIL" is required');
  });

  it('should throw for an invalid SUPPORT_EMAIL', () => {
    const result = emailSchema.validate({
      ...fullConfig,
      SUPPORT_EMAIL: 'bad@example',
    });
    expect(result.error).toBeInstanceOf(Error);
    expect(result.error.message).toBe('"SUPPORT_EMAIL" must be a valid email');
  });
});

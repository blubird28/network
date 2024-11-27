import { shieldApiSchema } from './shield-api.schema';

describe('config schema for shield api', () => {
  const fullConfig = {
    SHIELD_API_URL: 'http://api',
  };

  it('should pass for a valid config', () => {
    const result = shieldApiSchema.validate(fullConfig);
    expect(result.error).toBeUndefined();
  });

  it('should throw for a missing SHIELD_API_URL', () => {
    const result = shieldApiSchema.validate({
      ...fullConfig,
      SHIELD_API_URL: undefined,
    });
    expect(result.error).toBeInstanceOf(Error);
    expect(result.error.message).toBe('"SHIELD_API_URL" is required');
  });

  it('should throw for an invalid SHIELD_API_URL', () => {
    const result = shieldApiSchema.validate({
      ...fullConfig,
      SHIELD_API_URL: 'I dunno, google it',
    });
    expect(result.error).toBeInstanceOf(Error);
    expect(result.error.message).toBe('"SHIELD_API_URL" must be a valid uri');
  });
});

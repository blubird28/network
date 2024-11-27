import { shieldAppSchema } from './shield-app.schema';

describe('config schema for shield app', () => {
  const fullConfig = {
    SHIELD_APP_URL: 'http://shield',
  };

  it('should pass for a valid config', () => {
    const result = shieldAppSchema.validate(fullConfig);
    expect(result.error).toBeUndefined();
  });

  it('should throw for a missing SHIELD_APP_URL', () => {
    const result = shieldAppSchema.validate({
      ...fullConfig,
      SHIELD_APP_URL: undefined,
    });
    expect(result.error).toBeInstanceOf(Error);
    expect(result.error.message).toBe('"SHIELD_APP_URL" is required');
  });

  it('should throw for an invalid SHIELD_APP_URL', () => {
    const result = shieldAppSchema.validate({
      ...fullConfig,
      SHIELD_APP_URL: 'I dunno, google it',
    });
    expect(result.error).toBeInstanceOf(Error);
    expect(result.error.message).toBe('"SHIELD_APP_URL" must be a valid uri');
  });
});

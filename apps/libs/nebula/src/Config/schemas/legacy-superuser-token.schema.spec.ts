import { legacySuperUserTokenSchema } from './legacy-superuser-token.schema';

describe('config schema for shield api', () => {
  const fullConfig = {
    LEGACY_SUPERUSER_TOKEN: 'CorrectHorseBatteryStaple',
  };

  it('should pass for a valid config', () => {
    const result = legacySuperUserTokenSchema.validate(fullConfig);
    expect(result.error).toBeUndefined();
  });

  it('should throw for a missing LEGACY_SUPERUSER_TOKEN', () => {
    const result = legacySuperUserTokenSchema.validate({
      ...fullConfig,
      LEGACY_SUPERUSER_TOKEN: undefined,
    });
    expect(result.error).toBeInstanceOf(Error);
    expect(result.error.message).toBe('"LEGACY_SUPERUSER_TOKEN" is required');
  });

  it('should throw for an invalid LEGACY_SUPERUSER_TOKEN', () => {
    const result = legacySuperUserTokenSchema.validate({
      ...fullConfig,
      LEGACY_SUPERUSER_TOKEN: '',
    });
    expect(result.error).toBeInstanceOf(Error);
    expect(result.error.message).toBe(
      '"LEGACY_SUPERUSER_TOKEN" is not allowed to be empty',
    );
  });
});

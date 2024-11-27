import { keyholderRoleSchema } from './keyholder-role.schema';

describe('config schema for Console Keyholder Role', () => {
  const fullConfig = {
    KEYHOLDER_ROLE_ID: '00001133003459007ea700a8',
  };

  it('should pass for a valid config', () => {
    const result = keyholderRoleSchema.validate(fullConfig);
    expect(result.error).toBeUndefined();
  });

  it('should throw for a missing KEYHOLDER_ROLE_ID', () => {
    const result = keyholderRoleSchema.validate({
      ...fullConfig,
      KEYHOLDER_ROLE_ID: undefined,
    });

    expect(result.error).toBeInstanceOf(Error);
    expect(result.error.message).toBe('"KEYHOLDER_ROLE_ID" is required');
  });

  it('should throw for an invalid KEYHOLDER_ROLE_ID', () => {
    // eslint-disable-next-line @typescript-eslint/no-loss-of-precision
    const invalidKeyholderId = 800001133003459007517001;
    const result = keyholderRoleSchema.validate({
      ...fullConfig,
      KEYHOLDER_ROLE_ID: invalidKeyholderId,
    });

    expect(result.error).toBeInstanceOf(Error);
    expect(result.error.message).toBe('"KEYHOLDER_ROLE_ID" must be a string');
  });
});

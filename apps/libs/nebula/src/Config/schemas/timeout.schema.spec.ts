import { TimeoutSchema } from './timeout.schema';

describe('validate API request config schema', () => {
  const config = {
    REQUEST_TIMEOUT: 5000,
  };
  it('should pass for a valid config', () => {
    const result = TimeoutSchema.validate(config);
    expect(result.error).toBeUndefined();
  });
  Object.keys(config).forEach((key) => {
    it(`should throw for a missing ${key}`, () => {
      const result = TimeoutSchema.validate({
        ...config,
        [key]: undefined,
      });
      expect(result.error).toBeInstanceOf(Error);
      expect(result.error.message).toBe(`"${key}" is required`);
    });
  });
});

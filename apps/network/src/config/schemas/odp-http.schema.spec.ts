import { odpHttpSchema } from './odp-http.schema';

describe('config schema for ODP api', () => {
  const fullConfig = {
    ODP_API_BASE_URL: 'http://api',
    ODP_API_CLIENT_KEY: 'key',
    ODP_API_CLIENT_SECRET: 'secret',
  };

  it('should pass for a valid config', () => {
    const result = odpHttpSchema.validate(fullConfig);
    expect(result.error).toBeUndefined();
  });
  ['ODP_API_BASE_URL', 'ODP_API_CLIENT_KEY', 'ODP_API_CLIENT_SECRET'].forEach(
    (key) =>
      it(`should throw for a missing ${key}`, () => {
        const result = odpHttpSchema.validate({
          ...fullConfig,
          [key]: undefined,
        });
        expect(result.error).toBeInstanceOf(Error);
        expect(result.error.message).toBe(`"${key}" is required`);
      }),
  );

  it('should throw for an invalid ODP_API_BASE_URL', () => {
    const result = odpHttpSchema.validate({
      ...fullConfig,
      ODP_API_BASE_URL: 'I dunno, google it',
    });
    expect(result.error).toBeInstanceOf(Error);
    expect(result.error.message).toBe('"ODP_API_BASE_URL" must be a valid uri');
  });
});

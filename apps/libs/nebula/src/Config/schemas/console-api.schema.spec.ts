import { consoleApiSchema } from './console-api.schema';

describe('config schema for console api', () => {
  const fullConfig = {
    CONSOLE_PUBLIC_API_URL: 'http://api',
  };

  it('should pass for a valid config', () => {
    const result = consoleApiSchema.validate(fullConfig);
    expect(result.error).toBeUndefined();
  });

  it('should throw for a missing CONSOLE_PUBLIC_API_URL', () => {
    const result = consoleApiSchema.validate({
      ...fullConfig,
      CONSOLE_PUBLIC_API_URL: undefined,
    });
    expect(result.error).toBeInstanceOf(Error);
    expect(result.error.message).toBe('"CONSOLE_PUBLIC_API_URL" is required');
  });

  it('should throw for an invalid CONSOLE_PUBLIC_API_URL', () => {
    const result = consoleApiSchema.validate({
      ...fullConfig,
      CONSOLE_PUBLIC_API_URL: 'I dunno, google it',
    });
    expect(result.error).toBeInstanceOf(Error);
    expect(result.error.message).toBe(
      '"CONSOLE_PUBLIC_API_URL" must be a valid uri',
    );
  });
});

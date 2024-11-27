import { consoleAppSchema } from './console-app.schema';

describe('config schema for console app', () => {
  const fullConfig = {
    CONSOLE_APP_URL: 'http://console',
  };

  it('should pass for a valid config', () => {
    const result = consoleAppSchema.validate(fullConfig);
    expect(result.error).toBeUndefined();
  });

  it('should throw for a missing CONSOLE_APP_URL', () => {
    const result = consoleAppSchema.validate({
      ...fullConfig,
      CONSOLE_APP_URL: undefined,
    });
    expect(result.error).toBeInstanceOf(Error);
    expect(result.error.message).toBe('"CONSOLE_APP_URL" is required');
  });

  it('should throw for an invalid CONSOLE_APP_URL', () => {
    const result = consoleAppSchema.validate({
      ...fullConfig,
      CONSOLE_APP_URL: 'I dunno, google it',
    });
    expect(result.error).toBeInstanceOf(Error);
    expect(result.error.message).toBe('"CONSOLE_APP_URL" must be a valid uri');
  });
});

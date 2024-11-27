import { baseSchema } from './base.schema';

describe('environment config schema', () => {
  const fullConfig = {
    APP_NAME: 'some-app',
    LOG_LEVEL: 'silly',
    NODE_ENV: 'test',
    CONSOLE_ENV: 'development',
  };

  it('should pass for a valid config', () => {
    const result = baseSchema.validate(fullConfig);
    expect(result.error).toBeUndefined();
  });

  it('should throw for a missing APP_NAME', () => {
    const result = baseSchema.validate({ ...fullConfig, APP_NAME: undefined });
    expect(result.error).toBeInstanceOf(Error);
    expect(result.error.message).toBe('"APP_NAME" is required');
  });

  it('should throw for a invalid LOG_LEVEL', () => {
    const result = baseSchema.validate({
      ...fullConfig,
      LOG_LEVEL: 'top-secret',
    });
    expect(result.error).toBeInstanceOf(Error);
    expect(result.error.message).toBe(
      '"LOG_LEVEL" must be one of [error, warn, info, http, verbose, debug, silly]',
    );
  });

  it('should throw for a invalid NODE_ENV', () => {
    const result = baseSchema.validate({ ...fullConfig, NODE_ENV: 'outside' });
    expect(result.error).toBeInstanceOf(Error);
    expect(result.error.message).toBe(
      '"NODE_ENV" must be one of [test, development, production]',
    );
  });

  it('should throw for a invalid CONSOLE_ENV', () => {
    const result = baseSchema.validate({
      ...fullConfig,
      CONSOLE_ENV: 'outside',
    });
    expect(result.error).toBeInstanceOf(Error);
    expect(result.error.message).toMatchInlineSnapshot(
      `"\\"CONSOLE_ENV\\" must be one of [development, uat, stage, production]"`,
    );
  });

  it('should default LOG_LEVEL to info', () => {
    const result = baseSchema.validate({ ...fullConfig, LOG_LEVEL: undefined });
    expect(result.value.LOG_LEVEL).toBe('info');
  });

  it('should default NODE_ENV to development', () => {
    const result = baseSchema.validate({ ...fullConfig, NODE_ENV: undefined });
    expect(result.value.NODE_ENV).toBe('development');
  });
});

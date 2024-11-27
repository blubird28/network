import { appSchema } from './app.schema';

describe('config schema for full nest apps', () => {
  const fullConfig = {
    APP_PORT: '123',
  };

  it('should pass for a valid config', () => {
    const result = appSchema.validate(fullConfig);
    expect(result.error).toBeUndefined();
  });

  it('should throw for a missing APP_PORT', () => {
    const result = appSchema.validate({});
    expect(result.error).toBeInstanceOf(Error);
    expect(result.error.message).toBe('"APP_PORT" is required');
  });

  it('should convert APP_PORT to a number', () => {
    const result = appSchema.validate(fullConfig);
    expect(result.value.APP_PORT).toBe(123);
  });
});

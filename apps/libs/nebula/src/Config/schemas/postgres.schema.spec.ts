import { postgresSchema } from './postgres.schema';

describe('config schema for postgres connection', () => {
  const fullConfig = {
    POSTGRES_HOST: '0.0.0.0',
    POSTGRES_PORT: '123',
    POSTGRES_NAME: 'database',
    POSTGRES_USER: 'user',
    POSTGRES_PASSWORD: 'password',
    POSTGRES_CA_PATH: '/path/to/ca',
    POSTGRES_CERT_PATH: '/path/to/cert',
    POSTGRES_KEY_PATH: '/path/to/key',
  };

  it('should pass for a valid config', () => {
    const result = postgresSchema.validate(fullConfig);
    expect(result.error).toBeUndefined();
  });

  it('should pass for a config without any ssl parameters', () => {
    const result = postgresSchema.validate({
      ...fullConfig,
      POSTGRES_CA_PATH: undefined,
      POSTGRES_CERT_PATH: undefined,
      POSTGRES_KEY_PATH: undefined,
    });
    expect(result.error).toBeUndefined();
  });

  it('should throw for a config with some but not all ssl parameters', () => {
    const result = postgresSchema.validate({
      ...fullConfig,
      POSTGRES_KEY_PATH: undefined,
    });
    expect(result.error).toBeInstanceOf(Error);
    expect(result.error.message).toBe(
      '"value" contains [POSTGRES_CA_PATH, POSTGRES_CERT_PATH] without its required peers [POSTGRES_KEY_PATH]',
    );
  });

  [
    'POSTGRES_HOST',
    'POSTGRES_PORT',
    'POSTGRES_NAME',
    'POSTGRES_USER',
    'POSTGRES_PASSWORD',
  ].forEach((key) => {
    it(`should throw for a missing ${key}`, () => {
      const result = postgresSchema.validate({
        ...fullConfig,
        [key]: undefined,
      });
      expect(result.error).toBeInstanceOf(Error);
      expect(result.error.message).toBe(`"${key}" is required`);
    });
  });

  it('should throw for an invalid POSTGRES_HOST', () => {
    const result = postgresSchema.validate({
      ...fullConfig,
      POSTGRES_HOST: '1.2.3.4.5',
    });
    expect(result.error).toBeInstanceOf(Error);
    expect(result.error.message).toBe(
      '"POSTGRES_HOST" must be a valid hostname',
    );
  });

  it('should convert POSTGRES_PORT to a number', () => {
    const result = postgresSchema.validate(fullConfig);
    expect(result.value.POSTGRES_PORT).toBe(123);
  });
});

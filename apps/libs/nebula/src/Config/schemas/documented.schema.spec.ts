import { documentedSchema, PATH_REGEX } from './documented.schema';

describe('config schema for microservice nest apps', () => {
  const fullConfig = {
    OPENAPI_TITLE: 'name',
    OPENAPI_DESCRIPTION: 'description',
    OPENAPI_SERVER: '/server',
    OPENAPI_SERVER_DESCRIPTION: 'The server',
  };

  it('should pass for a valid config', () => {
    const result = documentedSchema.validate(fullConfig);
    expect(result.error).toBeUndefined();
  });

  it('should pass for no config', () => {
    const result = documentedSchema.validate({});
    expect(result.error).toBeUndefined();
  });

  it('should throw for empty config', () => {
    Object.keys(fullConfig).forEach((key) => {
      const result = documentedSchema.validate({
        ...fullConfig,
        [key]: '',
      });
      expect(result.error).toBeInstanceOf(Error);
      expect(result.error.message).toBe(`"${key}" is not allowed to be empty`);
    });
  });

  it('should throw for invalid OPENAPI_SERVER', () => {
    const invalid = 'http://somewhere.else/over/there';
    const result = documentedSchema.validate({
      ...fullConfig,
      OPENAPI_SERVER: invalid,
    });
    expect(result.error).toBeInstanceOf(Error);
    expect(result.error.message).toBe(
      `"OPENAPI_SERVER" with value "${invalid}" fails to match the required pattern: ${PATH_REGEX}`,
    );
  });
});

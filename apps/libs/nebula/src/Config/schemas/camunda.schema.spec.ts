import { camundaSchema } from './camunda.schema';

describe('config schema for camunda workflow', () => {
  const fullConfig = {
    CAMUNDA_BASE_URL: 'http://example.com:3000',
    CAMUNDA_BASE_PATH: 'api',
  };
  it('should pass for a valid config', () => {
    const result = camundaSchema.validate(fullConfig);
    expect(result.error).toBeUndefined();
  });
  Object.keys(fullConfig).forEach((key) => {
    it(`should throw for a missing ${key}`, () => {
      const result = camundaSchema.validate({
        ...fullConfig,
        [key]: undefined,
      });
      expect(result.error).toBeInstanceOf(Error);
      expect(result.error.message).toBe(`"${key}" is required`);
    });
  });
});

import { tykConfigSchema } from './tyk-config.schema';

describe('configuration schema for tyk', () => {
  it('errors with empty values', () => {
    expect.hasAssertions();

    const result = tykConfigSchema.validate({
      TYK_ENABLED: undefined,
    });

    expect(result.error).toBeInstanceOf(Error);
    expect(result.error.message).toBe('"TYK_ENABLED" is required');
  });

  it('gives us a valid configuration object', () => {
    expect.hasAssertions();

    const config = {
      TYK_ENABLED: 'true',
      TYK_API_ID: 'testApiId',
      TYK_DASHBOARD_API_URL: 'https://mock.tyk.api',
      TYK_DASHBOARD_API_TOKEN: 'testApiToken',
    };

    const result = tykConfigSchema.validate(config);
    expect(result.error).toBeUndefined();
    expect(result.value.TYK_API_ID).toStrictEqual(config.TYK_API_ID);
    expect(result.value.TYK_ENABLED).toBe(true);
  });

  it('should throw an error if TYK_ENABLED is not a boolean', () => {
    expect.hasAssertions();
    const config = {
      TYK_ENABLED: 'yes', // Invalid value, not a boolean
      TYK_API_ID: 'testApiId',
      TYK_DASHBOARD_API_URL: 'https://mock.tyk.api',
      TYK_DASHBOARD_API_TOKEN: 'testApiToken',
    };

    const { error } = tykConfigSchema.validate(config);
    expect(error).toBeDefined();
    expect(error?.message).toMatch(/"TYK_ENABLED" must be a boolean/);
  });

  it('should throw an error if TYK_API_ID is missing', () => {
    expect.hasAssertions();
    const config = {
      TYK_ENABLED: 'true',
      TYK_DASHBOARD_API_URL: 'https://mock.tyk.api',
      TYK_DASHBOARD_API_TOKEN: 'testApiToken',
    };

    const { error } = tykConfigSchema.validate(config);
    expect(error).toBeDefined();
    expect(error?.message).toMatch(/"TYK_API_ID" is required/);
  });

  it('should throw an error if TYK_DASHBOARD_API_URL is missing', () => {
    expect.hasAssertions();
    const config = {
      TYK_ENABLED: 'true',
      TYK_API_ID: 'testApiId',
      TYK_DASHBOARD_API_TOKEN: 'testApiToken',
    };

    const { error } = tykConfigSchema.validate(config);
    expect(error).toBeDefined();
    expect(error?.message).toMatch(/"TYK_DASHBOARD_API_URL" is required/);
  });

  it('should throw an error if TYK_DASHBOARD_API_TOKEN is missing', () => {
    expect.hasAssertions();
    const config = {
      TYK_ENABLED: 'true',
      TYK_API_ID: 'testApiId',
      TYK_DASHBOARD_API_URL: 'https://mock.tyk.api',
    };

    const { error } = tykConfigSchema.validate(config);
    expect(error).toBeDefined();
    expect(error?.message).toMatch(/"TYK_DASHBOARD_API_TOKEN" is required/);
  });
});

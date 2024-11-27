import { DEFAULT_SENDGRID_TEMPLATE_CACHE_TTL } from '../config.constants';

import { sendGridConfig } from './sendgrid.schema';

describe('configuration for SendGrid integration', () => {
  it('errors without an api key', () => {
    expect.hasAssertions();

    const result = sendGridConfig.validate({});
    expect(result.error).toBeInstanceOf(Error);
    expect(result.error.message).toBe('"SENDGRID_API_KEY" is required');
  });

  it('gives us valid configuration with defaults', () => {
    expect.hasAssertions();

    const value = {
      SENDGRID_API_KEY: 'le-api-key',
    };

    const result = sendGridConfig.validate(value);
    expect(result.error).toBeUndefined();
    expect(result.value).toStrictEqual({
      ...value,
      SENDGRID_TEMPLATE_CACHE_TTL: DEFAULT_SENDGRID_TEMPLATE_CACHE_TTL,
    });
  });

  it('gives us valid configuration with specific TTL', () => {
    expect.hasAssertions();

    const value = {
      SENDGRID_API_KEY: 'le-api-key',
      SENDGRID_TEMPLATE_CACHE_TTL: 42,
    };

    const result = sendGridConfig.validate(value);
    expect(result.error).toBeUndefined();
    expect(result.value).toStrictEqual({
      ...value,
      SENDGRID_TEMPLATE_CACHE_TTL: 42,
    });
  });

  it('gives error for invalid TTL', () => {
    expect.hasAssertions();

    const value = {
      SENDGRID_API_KEY: 'le-api-key',
      SENDGRID_TEMPLATE_CACHE_TTL: 'until they start to turn',
    };

    const result = sendGridConfig.validate(value);
    expect(result.error).toBeInstanceOf(Error);
    expect(result.error.message).toBe(
      '"SENDGRID_TEMPLATE_CACHE_TTL" must be a number',
    );
  });
});

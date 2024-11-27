import { searchServiceSchema } from './search-service.schema';

describe('config schema for search service', () => {
  const fullConfig = {
    PUBSUB_PROJECT: 'project',
    SEARCH_SERVICE_TOPIC: 'search_topic',
    SEARCH_SERVICE_URL: 'http://search.local.url',
  };

  it('should pass for a valid config', () => {
    const result = searchServiceSchema.validate(fullConfig);
    expect(result.error).toBeUndefined();
  });

  it(`should throw for an invalid SEARCH_SERVICE_URL`, () => {
    const result = searchServiceSchema.validate({
      ...fullConfig,
      SEARCH_SERVICE_URL: 'earl',
    });
    expect(result.error).toBeInstanceOf(Error);
    expect(result.error.message).toBe(
      '"SEARCH_SERVICE_URL" must be a valid uri',
    );
  });

  Object.keys(fullConfig).forEach((key) => {
    it(`should throw for a missing ${key}`, () => {
      const result = searchServiceSchema.validate({
        ...fullConfig,
        [key]: undefined,
      });
      expect(result.error).toBeInstanceOf(Error);
      expect(result.error.message).toBe(`"${key}" is required`);
    });
  });
});

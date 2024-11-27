import { elasticSearchSchema } from './elasticsearch.schema';

describe('config schema for elastic search', () => {
  const fullConfig = {
    ELASTICSEARCH_NODE: 'http://localhost:9200',
    ELASTICSEARCH_API_KEY: 'api-key',
  };

  it('should pass for a valid config', () => {
    const result = elasticSearchSchema.validate(fullConfig);
    expect(result.error).toBeUndefined();
  });

  it('should throw for a missing ELASTICSEARCH_NODE', () => {
    const result = elasticSearchSchema.validate({
      ...fullConfig,
      ELASTICSEARCH_NODE: undefined,
    });
    expect(result.error).toBeInstanceOf(Error);
    expect(result.error.message).toBe('"ELASTICSEARCH_NODE" is required');
  });

  it('should throw for an invalid ELASTICSEARCH_NODE', () => {
    const result = elasticSearchSchema.validate({
      ...fullConfig,
      ELASTICSEARCH_NODE: 'not a uri',
    });
    expect(result.error).toBeInstanceOf(Error);
    expect(result.error.message).toBe(
      '"ELASTICSEARCH_NODE" must be a valid uri',
    );
  });
});

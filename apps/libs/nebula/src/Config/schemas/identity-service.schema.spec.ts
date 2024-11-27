import { identityServiceSchema } from './identity-service.schema';

describe('config schema for identity service', () => {
  const fullConfig = {
    PUBSUB_PROJECT: 'project',
    IDENTITY_SERVICE_TOPIC: 'identity_topic',
    IDENTITY_SERVICE_URL: 'http://identity.local.url',
  };

  it('should pass for a valid config', () => {
    const result = identityServiceSchema.validate(fullConfig);
    expect(result.error).toBeUndefined();
  });

  it(`should throw for an invalid IDENTITY_SERVICE_URL`, () => {
    const result = identityServiceSchema.validate({
      ...fullConfig,
      IDENTITY_SERVICE_URL: 'earl',
    });
    expect(result.error).toBeInstanceOf(Error);
    expect(result.error.message).toBe(
      '"IDENTITY_SERVICE_URL" must be a valid uri',
    );
  });

  it('should allow a missing IDENTITY_SERVICE_TOPIC', () => {
    const result = identityServiceSchema.validate({
      ...fullConfig,
      IDENTITY_SERVICE_TOPIC: undefined,
    });
    expect(result.error).toBeUndefined();
  });

  ['PUBSUB_PROJECT', 'IDENTITY_SERVICE_URL'].forEach((key) => {
    it(`should throw for a missing ${key}`, () => {
      const result = identityServiceSchema.validate({
        ...fullConfig,
        [key]: undefined,
      });
      expect(result.error).toBeInstanceOf(Error);
      expect(result.error.message).toBe(`"${key}" is required`);
    });
  });
});

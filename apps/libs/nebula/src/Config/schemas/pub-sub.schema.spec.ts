import { pubSubSchema } from './pub-sub.schema';

describe('configuration schema for pubsub', () => {
  it('errors with empty values', () => {
    expect.hasAssertions();

    const result = pubSubSchema.validate({
      PUBSUB_PROJECT: undefined,
    });

    expect(result.error).toBeInstanceOf(Error);
    expect(result.error.message).toBe('"PUBSUB_PROJECT" is required');
  });

  it('gives us a valid configuration object', () => {
    expect.hasAssertions();

    const value = {
      PUBSUB_PROJECT: 'project',
      PUBSUB_EMULATOR_HOST: 'localhost:1234',
    };

    const result = pubSubSchema.validate(value);

    expect(result.error).toBeUndefined();
    expect(result.value).toStrictEqual(value);
  });

  it('allows empty emulator', () => {
    expect.hasAssertions();

    const value = {
      PUBSUB_PROJECT: 'project',
    };

    const result = pubSubSchema.validate(value);

    expect(result.error).toBeUndefined();
    expect(result.value).toStrictEqual(value);
  });
});

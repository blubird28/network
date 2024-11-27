import { pubSubServerSchema } from './pub-sub-server.schema';
describe('config schema for pub sub server', () => {
  const fullConfig = {
    PUBSUB_PROJECT: 'project',
    PUBSUB_TOPIC: 'topic',
    PUBSUB_SUBSCRIPTION: 'topic_subscription',
  };

  it('should pass for a valid config', () => {
    const result = pubSubServerSchema.validate(fullConfig);
    expect(result.error).toBeUndefined();
  });

  Object.keys(fullConfig).forEach((key) => {
    it(`should throw for a missing ${key}`, () => {
      const result = pubSubServerSchema.validate({
        ...fullConfig,
        [key]: undefined,
      });
      expect(result.error).toBeInstanceOf(Error);
      expect(result.error.message).toBe(`"${key}" is required`);
    });
  });

  it('should handle additional config', () => {
    const result = pubSubServerSchema.validate({
      ...fullConfig,
      PUBSUB_ADDITIONAL_SUBSCRIPTIONS: 'topic1:sub1;topic2:sub2;topic3:sub3',
    });
    expect(result.error).toBeUndefined();
    expect(result.value.PUBSUB_ADDITIONAL_SUBSCRIPTIONS).toStrictEqual([
      { topicName: 'topic1', subscriptionName: 'sub1' },
      { topicName: 'topic2', subscriptionName: 'sub2' },
      { topicName: 'topic3', subscriptionName: 'sub3' },
    ]);
  });
});

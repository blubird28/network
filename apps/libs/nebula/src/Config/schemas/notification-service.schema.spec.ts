import { notificationServiceSchema } from './notification-service.schema';

describe('config schema for notification service', () => {
  const fullConfig = {
    PUBSUB_PROJECT: 'project',
    NOTIFICATION_SERVICE_TOPIC: 'notification_topic',
  };

  it('should pass for a valid config', () => {
    const result = notificationServiceSchema.validate(fullConfig);
    expect(result.error).toBeUndefined();
  });

  it('should allow a missing NOTIFICATION_SERVICE_TOPIC', () => {
    const result = notificationServiceSchema.validate({
      ...fullConfig,
      NOTIFICATION_SERVICE_TOPIC: undefined,
    });
    expect(result.error).toBeUndefined();
  });

  ['PUBSUB_PROJECT'].forEach((key) => {
    it(`should throw for a missing ${key}`, () => {
      const result = notificationServiceSchema.validate({
        ...fullConfig,
        [key]: undefined,
      });
      expect(result.error).toBeInstanceOf(Error);
      expect(result.error.message).toBe(`"${key}" is required`);
    });
  });
});

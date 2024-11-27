import { Test, TestingModule } from '@nestjs/testing';

import { Mocker } from '../testing/mocker/mocker';
import { MockerBuilder } from '../testing/mocker/mocker.builder';
import { NotificationServiceConfig } from '../Config/schemas/notification-service.schema';

import { NotificationModule } from './notification.module';
import { NotificationClient } from './notification.client';

describe('NotificationsModule', () => {
  let client: NotificationClient;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [NotificationModule],
    })
      .useMocker(
        new Mocker(
          MockerBuilder.mockConfig<NotificationServiceConfig>({
            PUBSUB_PROJECT: 'project',
            NOTIFICATION_SERVICE_TOPIC: 'topic',
          }),
        ).mock(),
      )
      .compile();

    client = module.get<NotificationClient>(NotificationClient);
  });

  it('should instantiate the service', () => {
    expect(client).toBeDefined();
    expect(client).toBeInstanceOf(NotificationClient);
    expect(Reflect.get(client, 'clientName')).toBe('notification-service');
    expect(Reflect.get(client, 'topicName')).toBe('topic');
    expect(Reflect.get(client, 'projectId')).toBe('project');
  });
});

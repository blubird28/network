import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { NotificationServiceConfig } from '../Config/schemas/notification-service.schema';

import { NotificationClient } from './notification.client';

@Module({
  providers: [
    {
      provide: NotificationClient,
      useFactory: async (
        configService: ConfigService<NotificationServiceConfig>,
      ) => {
        const topicName = configService.get('NOTIFICATION_SERVICE_TOPIC');
        const projectId = configService.get('PUBSUB_PROJECT');

        return topicName && projectId
          ? new NotificationClient({
              clientName: 'notification-service',
              topicName,
              projectId,
            })
          : undefined;
      },
      inject: [ConfigService],
    },
  ],
  exports: [NotificationClient],
})
export class NotificationModule {}

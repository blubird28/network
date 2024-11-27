import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { PubSubClient } from '../PubSub/pubsub.client';
import { IdentityServiceConfig } from '../Config/schemas/identity-service.schema';
import { IdentityHttpService } from '../Http/Identity/identity-http.service';

import { IDENTITY_SERVICE_TOKEN } from './identity.constants';

@Module({
  providers: [
    {
      provide: IDENTITY_SERVICE_TOKEN,
      useFactory: async (
        configService: ConfigService<IdentityServiceConfig>,
      ) => {
        const topicName = configService.get('IDENTITY_SERVICE_TOPIC');
        const projectId = configService.get('PUBSUB_PROJECT');

        return topicName && projectId
          ? new PubSubClient({
              clientName: 'identity-service',
              topicName,
              projectId,
            })
          : undefined;
      },
      inject: [ConfigService],
    },
    IdentityHttpService,
  ],
  exports: [IDENTITY_SERVICE_TOKEN, IdentityHttpService],
})
export class IdentityModule {}

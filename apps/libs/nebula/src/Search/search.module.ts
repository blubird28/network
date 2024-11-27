import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { SearchServiceConfig } from '../Config/schemas/search-service.schema';
import { PubSubClient } from '../PubSub/pubsub.client';
import { SearchHttpService } from '../Http/Search/search-http.service';

import { SEARCH_SERVICE_TOKEN } from './search.constants';

@Module({
  providers: [
    {
      provide: SEARCH_SERVICE_TOKEN,
      useFactory: async (configService: ConfigService<SearchServiceConfig>) => {
        const topicName = configService.get('SEARCH_SERVICE_TOPIC');
        const projectId = configService.get('PUBSUB_PROJECT');

        return new PubSubClient({
          topicName,
          projectId,
          clientName: 'search-service',
        });
      },
      inject: [ConfigService],
    },
    SearchHttpService,
  ],
  exports: [SEARCH_SERVICE_TOKEN, SearchHttpService],
})
export class SearchModule {}

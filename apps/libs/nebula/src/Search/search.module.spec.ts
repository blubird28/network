import { Test, TestingModule } from '@nestjs/testing';
import { ClientProxy } from '@nestjs/microservices';

import { Mocker } from '../testing/mocker/mocker';
import { MockerBuilder } from '../testing/mocker/mocker.builder';
import { PubSubClient } from '../PubSub/pubsub.client';
import { SearchServiceConfig } from '../Config/schemas/search-service.schema';
import { SearchHttpService } from '../Http/Search/search-http.service';

import { SEARCH_SERVICE_TOKEN } from './search.constants';
import { SearchModule } from './search.module';

describe('SearchModule', () => {
  let client: ClientProxy;
  let service: SearchHttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SearchModule],
    })
      .useMocker(
        new Mocker(
          MockerBuilder.mockConfig<SearchServiceConfig>({
            PUBSUB_PROJECT: 'project',
            SEARCH_SERVICE_TOPIC: 'topic',
          }),
        ).mock(),
      )
      .compile();

    client = module.get<ClientProxy>(SEARCH_SERVICE_TOKEN);
    service = module.get<SearchHttpService>(SearchHttpService);
  });

  it('should instantiate the service', () => {
    expect(client).toBeDefined();
    expect(client).toBeInstanceOf(PubSubClient);
    expect(Reflect.get(client, 'clientName')).toBe('search-service');
    expect(Reflect.get(client, 'topicName')).toBe('topic');
    expect(Reflect.get(client, 'projectId')).toBe('project');
    expect(service).toBeDefined();
    expect(service).toBeInstanceOf(SearchHttpService);
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { ClientProxy } from '@nestjs/microservices';

import { Mocker } from '../testing/mocker/mocker';
import { MockerBuilder } from '../testing/mocker/mocker.builder';
import { PubSubClient } from '../PubSub/pubsub.client';
import { IdentityServiceConfig } from '../Config/schemas/identity-service.schema';
import { IdentityHttpService } from '../Http/Identity/identity-http.service';

import { IDENTITY_SERVICE_TOKEN } from './identity.constants';
import { IdentityModule } from './identity.module';

describe('IdentityModule', () => {
  let client: ClientProxy;
  let service: IdentityHttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [IdentityModule],
    })
      .useMocker(
        new Mocker(
          MockerBuilder.mockConfig<IdentityServiceConfig>({
            PUBSUB_PROJECT: 'project',
            IDENTITY_SERVICE_TOPIC: 'topic',
          }),
        ).mock(),
      )
      .compile();

    client = module.get<ClientProxy>(IDENTITY_SERVICE_TOKEN);
    service = module.get<IdentityHttpService>(IdentityHttpService);
  });

  it('should instantiate the service', () => {
    expect(client).toBeDefined();
    expect(client).toBeInstanceOf(PubSubClient);
    expect(Reflect.get(client, 'clientName')).toBe('identity-service');
    expect(Reflect.get(client, 'topicName')).toBe('topic');
    expect(Reflect.get(client, 'projectId')).toBe('project');
    expect(service).toBeDefined();
    expect(service).toBeInstanceOf(IdentityHttpService);
  });
});

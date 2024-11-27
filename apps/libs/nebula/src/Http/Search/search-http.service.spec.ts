import nock from 'nock';
import { lastValueFrom } from 'rxjs';

import { MockerBuilder } from '../../testing/mocker/mocker.builder';
import { HeartbeatResponseDto } from '../../Heartbeat/interfaces/dto/heartbeat-response.dto';
import { faker } from '../../testing/data/fakers';

import { SearchHttpService } from './search-http.service';

describe('SearchHttpService', () => {
  let service: SearchHttpService;
  let scope: nock.Scope;
  const apiUrl = 'https://test-api.url';

  beforeEach(async () => {
    service = new SearchHttpService(
      MockerBuilder.mockConfigService({
        SEARCH_SERVICE_URL: apiUrl,
      }),
    );
    scope = nock(apiUrl);
  });

  it('configures the client appropriately', async () => {
    scope
      .get('/test')
      .matchHeader('user-agent', 'constellation-search-http-service')
      .reply(200, 'OK');

    const result = await lastValueFrom(service.get('/test'));

    expect(result.status).toBe(200);
    expect(result.data).toBe('OK');
    expect(scope.isDone()).toBe(true);
  });

  it('gets client heartbeat', async () => {
    scope
      .get('/heartbeat')
      .matchHeader('user-agent', 'constellation-search-http-service')
      .reply(200, faker(HeartbeatResponseDto));

    const result = await lastValueFrom(service.getClientHeartbeat());

    expect(result).toStrictEqual(faker(HeartbeatResponseDto));
    expect(scope.isDone()).toBe(true);
  });
});

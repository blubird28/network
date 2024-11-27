import nock from 'nock';

import { MockerBuilder } from '@libs/nebula/testing/mocker/mocker.builder';

import { TykApiService, KeyMeta } from './tyk-api.service';

describe('TykApiService', () => {
  let service: TykApiService;
  let scope: nock.Scope;

  const metaData: KeyMeta = {
    key_id: 'my-key-id',
    key_hash: 'hash',
    data: { meta_data: { userid: 'my-user-id' } },
  };

  const mockConfig = {
    TYK_ENABLED: true,
    TYK_API_ID: 'tyk-api-id',
    TYK_DASHBOARD_API_URL: 'http://mock-tyk-url',
    TYK_DASHBOARD_API_TOKEN: 'mock-token',
  };

  describe('TykApiService', () => {
    beforeEach(async () => {
      service = new TykApiService(MockerBuilder.mockConfigService(mockConfig));
      scope = nock(mockConfig.TYK_DASHBOARD_API_URL);
    });

    afterEach(() => {
      nock.cleanAll();
    });

    it('should create axios instance when TYK is enabled', () => {
      const serviceInstance = service['instance'];
      expect(serviceInstance).toBeDefined();
      expect(serviceInstance.defaults.baseURL).toBe(
        mockConfig.TYK_DASHBOARD_API_URL,
      );
      expect(serviceInstance.defaults.headers.Authorization).toBe(
        `Bearer ${mockConfig.TYK_DASHBOARD_API_TOKEN}`,
      );
    });

    it('should return the correct key metadata when getKeyMeta is called', async () => {
      const keyID = 'my-key-id';
      const getString = `/api/apis/${mockConfig.TYK_API_ID}/keys/${keyID}`;
      scope
        .get(getString)
        .matchHeader(
          'Authorization',
          `Bearer ${mockConfig.TYK_DASHBOARD_API_TOKEN}`,
        )
        .reply(200, metaData);

      const result = await service.getKeyMeta(keyID);
      expect(result).toEqual(metaData);
      expect(scope.isDone()).toBe(true);
    });

    it('should throw an error when getKeyMeta is called with a failing request', async () => {
      const keyID = 'non-existent-key';
      const getString = `/api/apis/${mockConfig.TYK_API_ID}/keys/${keyID}`;
      scope
        .get(getString)
        .matchHeader(
          'Authorization',
          `Bearer ${mockConfig.TYK_DASHBOARD_API_TOKEN}`,
        )
        .reply(404, { message: 'Not Found' });

      await expect(service.getKeyMeta(keyID)).rejects.toThrow(
        'Request failed with status code 404',
      );
    });

    it('should throw an error if Tyk integration is disabled', async () => {
      const disabledConfig = {
        ...mockConfig,
        TYK_ENABLED: false,
      };
      service = new TykApiService(
        MockerBuilder.mockConfigService(disabledConfig),
      );

      const keyID = 'my-key-id';

      await expect(service.getKeyMeta(keyID)).rejects.toThrow(
        'Tyk integration is disabled.',
      );
    });
  });
});

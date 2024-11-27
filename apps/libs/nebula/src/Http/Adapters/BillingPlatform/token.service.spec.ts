import { from } from 'rxjs';
import { AxiosResponse } from 'axios';
import { createMock } from '@golevelup/ts-jest';

import { ConfigService } from '@nestjs/config';

import { BillingPlatformConfig } from '@libs/nebula/Config/schemas/billing-platform.schema';
import { MockerBuilder } from '@libs/nebula/testing/mocker/mocker.builder';
import { FAKE_TOKEN } from '@libs/nebula/testing/data/constants';

import { TokenService } from './token.service';
import { TokenData, TokenRequestBody } from './constants';

describe('TokenService', () => {
  let configService: ConfigService<BillingPlatformConfig, true>;
  let service: TokenService;
  let authBody: TokenRequestBody;
  let tokenResponseData: TokenData;

  const billingPlatformConfig: BillingPlatformConfig = {
    BP_BASE_URL: 'http://localhost:8080',
    BP_BASE_PATH: 'api',
    BP_AUTH_URL: 'http://localhost:8080',
    BP_AUTH_SYSTEM_ID: 'system_id',
    BP_AUTH_CLIENT_ID: 'client_id',
    BP_AUTH_CLIENT_SECRET: 'client_secret',
    BP_AUTH_GRANT_TYPE: 'grant_type',
    BP_AUTH_AUDIENCE: 'audience',
  };

  beforeEach(async () => {
    configService = MockerBuilder.mockConfigService({
      ...billingPlatformConfig,
    });
    service = new TokenService(configService);
    authBody = {
      system_id: `${configService.get('BP_AUTH_SYSTEM_ID')}`,
      client_id: `${configService.get('BP_AUTH_CLIENT_ID')}`,
      client_secret: `${configService.get('BP_AUTH_CLIENT_SECRET')}`,
      grant_type: `${configService.get('BP_AUTH_GRANT_TYPE')}`,
      audience: `${configService.get('BP_AUTH_AUDIENCE')}`,
    };
    tokenResponseData = { access_token: FAKE_TOKEN, expires_in: 3600 };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch a new token if the token is not set', async () => {
    const mockResponse = createMock<AxiosResponse>({ data: tokenResponseData });
    const fetchTokenSpy = jest
      .spyOn(service, 'post')
      .mockReturnValue(from([mockResponse]));

    const result = await service.getToken();

    expect(fetchTokenSpy).toHaveBeenCalled();
    expect(result).toBe(`Bearer ${FAKE_TOKEN}`);
    expect(service.post).toBeCalledWith('/oauth/token', {
      ...authBody,
    });
  });

  it('should fetch a new token if the token has expired', async () => {
    const mockResponse = createMock<AxiosResponse>({ data: tokenResponseData });
    const fetchTokenSpy = jest
      .spyOn(service, 'post')
      .mockReturnValue(from([mockResponse]));
    service.isTokenExpired = jest.fn().mockResolvedValue(true);

    const result = await service.getToken();

    expect(fetchTokenSpy).toHaveBeenCalled();
    expect(result).toBe(`Bearer ${FAKE_TOKEN}`);

    expect(service.post).toBeCalledWith('/oauth/token', {
      ...authBody,
    });
  });

  it('should not fetch a new token if the token is valid', async () => {
    const mockResponse = createMock<AxiosResponse>({ data: tokenResponseData });
    service.setToken(tokenResponseData);
    service.isTokenExpired = jest.fn().mockReturnValue(false);
    const fetchTokenSpy = jest
      .spyOn(service, 'post')
      .mockReturnValue(from([mockResponse]));

    await service.getToken();

    expect(fetchTokenSpy).not.toHaveBeenCalled();
    expect(service.isTokenExpired()).toBe(false);
  });

  it('should correctly determine if the token is alive', () => {
    service.setToken(tokenResponseData);
    const isExpired = service.isTokenExpired();

    expect(isExpired).toBe(false);
  });

  it('should check if the token expirationtime is not set', () => {
    const isExpired = service.isTokenExpired();

    expect(isExpired).toBe(true);
  });
});

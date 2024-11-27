import { from } from 'rxjs';
import { AxiosResponse } from 'axios';
import { createMock } from '@golevelup/ts-jest';

import { ConfigService } from '@nestjs/config';

import { BpPaymentWalletConfig } from '@libs/nebula/Config/schemas/bp-payment-wallet.schema';
import { MockerBuilder } from '@libs/nebula/testing/mocker/mocker.builder';
import { FAKE_TOKEN } from '@libs/nebula/testing/data/constants';

import { BPPaymentWalletTokenService } from './bp-token.service';
import { PaymentWalletTokenResponseData } from './constants';

describe('BPPaymentWalletTokenService', () => {
  let configService: ConfigService<BpPaymentWalletConfig, true>;
  let service: BPPaymentWalletTokenService;
  let authRequestQueryParams;
  let tokenResponseData: PaymentWalletTokenResponseData;

  const bpPaymentWalletConfig: BpPaymentWalletConfig = {
    BILLING_PLATFORM_URL: 'http://localhost:8080',
    BILLING_PLATFORM_AUTH_CLIENT_ID: 'client_id',
    BILLING_PLATFORM_AUTH_CLIENT_SECRET: 'client_secret',
    BILLING_PLATFORM_AUTH_GRANT_TYPE: 'grant_type',
  };

  const urlWithParams =
    '/auth/1.0/authenticate?client_id=client_id&client_secret=client_secret&grant_type=grant_type';

  beforeEach(async () => {
    configService = MockerBuilder.mockConfigService({
      ...bpPaymentWalletConfig,
    });
    service = new BPPaymentWalletTokenService(configService);
    authRequestQueryParams = {
      client_id: `${configService.get('BILLING_PLATFORM_AUTH_CLIENT_ID')}`,
      client_secret: `${configService.get(
        'BILLING_PLATFORM_AUTH_CLIENT_SECRET',
      )}`,
      grant_type: `${configService.get('BILLING_PLATFORM_AUTH_GRANT_TYPE')}`,
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
    expect(service.post).toBeCalledWith(urlWithParams);
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
    expect(service.post).toBeCalledWith(urlWithParams);
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

import { from, lastValueFrom } from 'rxjs';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { AxiosResponse } from 'axios';

import { ConfigService } from '@nestjs/config';

import { BillingPlatformConfig } from '@libs/nebula/Config/schemas/billing-platform.schema';
import { MockerBuilder } from '@libs/nebula/testing/mocker/mocker.builder';
import { faker } from '@libs/nebula/testing/data/fakers';
import { BPSubscriptionDto } from '@libs/nebula/dto/subscription/bp-subscription.dto';
import {
  FAKE_SUBSCRIPTION_RESPONSE,
  FAKE_TOKEN,
} from '@libs/nebula/testing/data/constants';
import convertCamelCaseToSnakeCase from '@libs/nebula/utils/data/convertCamelCaseToSnakeCase';
import { BPBillingAccountRequestDto } from '@libs/nebula/dto/billing-account/bp-billing-account-request.dto';
import { BPSubscriptionResponseDto } from '@libs/nebula/dto/subscription/bp-subscription-response.dto';
import { BPBillingAccountDto } from '@libs/nebula/dto/billing-account/bp-billing-account.dto';
import { ShieldCompanyDetailsDto } from '@libs/nebula/dto/billing-account/shield-company-details-dto';
import { ValidateAccountRequestDto } from '@libs/nebula/dto/billing-account/validate-account-request.dto';
import { BPEditBillingAccountRequestDto } from '@libs/nebula/dto/billing-account/bp-edit-billing-account-request.dto';
import { BillingAccountResponseDto } from '@libs/nebula/dto/billing-account/billing-account-response';
import { SubscriptionResponseDto } from '@libs/nebula/dto/subscription/subscription-response.dto';
import { BPSubscriptionTerminationDto } from '@libs/nebula/dto/subscription/bp-terminate-subscription.dto';
import { SubscriptionIdDto } from '@libs/nebula/dto/subscription/subscription-id.dto';

import { BillingPlatformService } from './billing-platform.service';
import { TokenService } from './token.service';
import {
  REST_BP_SUBSCRIPTION_PATH,
  REST_BP_TERMINATE_SUBSCRIPTION_PATH,
} from './constants';

describe('BillingPlatformService', () => {
  let service: BillingPlatformService;
  let configService: ConfigService<BillingPlatformConfig, true>;
  let tokenService: DeepMocked<TokenService>;
  const fakeBPSubscriptionDto = faker(BPSubscriptionDto);
  const fakeBillingAccountDto = faker(BPBillingAccountRequestDto);
  const fakeBPSubscriptionResponseDto = faker(BPSubscriptionResponseDto);
  const fakeBPBillingAccountDto = faker(BPBillingAccountDto);
  const fakeShieldCompanyDetailsDto = faker(ShieldCompanyDetailsDto);
  const fakeValidateAccountRequestDto = faker(ValidateAccountRequestDto);
  const fakeEditBillingAccountDto = faker(BPEditBillingAccountRequestDto);
  const fakeEditBillingAccountPlatformResponse = faker(
    BillingAccountResponseDto,
  );
  const fakeSubscriptionResponseDto = faker(SubscriptionResponseDto);
  const fakeSubscriptionIdDto = faker(SubscriptionIdDto);
  const fakeBPSubscriptionTerminationDto = faker(BPSubscriptionTerminationDto);

  const fakeBillingAccountPlatformResponse = {
    message: 'SUCCESS',
    id: 'ACCOUNT01',
  };

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

  let getTokenSpy;

  beforeEach(async () => {
    configService = MockerBuilder.mockConfigService({
      ...billingPlatformConfig,
    });
    tokenService = createMock<TokenService>();
    service = new BillingPlatformService(configService, tokenService);
    getTokenSpy = tokenService.getToken.mockResolvedValue(FAKE_TOKEN);
  });

  it('should call create subscription API and return response', async () => {
    expect.hasAssertions();
    jest
      .spyOn(service, 'post')
      .mockReturnValue(
        from([
          createMock<AxiosResponse>({ data: fakeSubscriptionResponseDto }),
        ]),
      );
    const billingPlatformSubscriptionRequest = convertCamelCaseToSnakeCase(
      fakeBPSubscriptionDto,
    );
    const result = await lastValueFrom(
      await service.createSubscription(fakeBPSubscriptionDto),
    );
    expect(result).toStrictEqual(FAKE_SUBSCRIPTION_RESPONSE);
    expect(service.post).toBeCalledWith(
      '/subscriptions',
      {
        ...billingPlatformSubscriptionRequest,
      },
      {
        headers: {
          Authorization: FAKE_TOKEN,
        },
      },
    );
  });

  it('should call get subscription API and return response', async () => {
    expect.hasAssertions();
    jest
      .spyOn(service, 'get')
      .mockReturnValue(
        from([
          createMock<AxiosResponse>({ data: fakeBPSubscriptionResponseDto }),
        ]),
      );

    tokenService.getToken.mockResolvedValue(FAKE_TOKEN);

    const subscriptionId = 'K0001243';
    const result = await lastValueFrom(
      await service.getSubscription(subscriptionId),
    );
    expect(result).toEqual(fakeBPSubscriptionResponseDto);
    expect(service.get).toBeCalledWith(`/subscriptions/${subscriptionId}`, {
      headers: {
        Authorization: FAKE_TOKEN,
      },
    });
  });

  it('should call terminate subscription API and return response', async () => {
    expect.hasAssertions();
    jest
      .spyOn(service, 'post')
      .mockReturnValue(
        from([
          createMock<AxiosResponse>({ data: fakeSubscriptionResponseDto }),
        ]),
      );

    const terminateSubscriptionData = convertCamelCaseToSnakeCase(
      fakeBPSubscriptionTerminationDto,
    );

    tokenService.getToken.mockResolvedValue(FAKE_TOKEN);

    const result = await lastValueFrom(
      await service.terminateSubscription(
        fakeSubscriptionIdDto,
        fakeBPSubscriptionTerminationDto,
      ),
    );

    expect(result).toEqual(fakeSubscriptionResponseDto);
    expect(service.post).toBeCalledWith(
      `${REST_BP_SUBSCRIPTION_PATH}/${fakeSubscriptionIdDto.id}${REST_BP_TERMINATE_SUBSCRIPTION_PATH}`,
      terminateSubscriptionData,
      {
        headers: {
          Authorization: FAKE_TOKEN,
        },
      },
    );
  });

  it('should call create billing-account API and return response', async () => {
    jest.spyOn(service, 'post').mockReturnValueOnce(
      from([
        createMock<AxiosResponse>({
          data: fakeBillingAccountPlatformResponse,
        }),
      ]),
    );
    const fakeBillingAccountRequest = convertCamelCaseToSnakeCase(
      fakeBillingAccountDto,
    );
    const result = await lastValueFrom(
      await service.createBillingAccount(fakeBillingAccountRequest),
    );
    expect(result).toStrictEqual(fakeBillingAccountPlatformResponse);
    expect(service.post).toBeCalledWith(
      `/billing-accounts`,
      {
        ...fakeBillingAccountRequest,
      },
      {
        headers: {
          Authorization: FAKE_TOKEN,
        },
      },
    );
  });

  it('should call get billing account and return response', async () => {
    expect.hasAssertions();
    jest.spyOn(service, 'get').mockReturnValue(
      from([
        createMock<AxiosResponse>({
          data: {
            message: 'Success',
            billing_account: { ...fakeBPBillingAccountDto },
          },
        }),
      ]),
    );

    const result = await service.getBillingAccount(
      fakeShieldCompanyDetailsDto.billingAccount,
      fakeValidateAccountRequestDto.transactionId,
    );

    expect(result.message).toStrictEqual('Success');
    expect(result.billingAccount).toBeDefined();
    expect(service.get).toBeCalledWith(
      `/billing-accounts/${fakeShieldCompanyDetailsDto.billingAccount}`,
      {
        headers: {
          Authorization: FAKE_TOKEN,
          'x-transaction-id': fakeValidateAccountRequestDto.transactionId,
        },
      },
    );
  });

  it('should call edit billing account API and return response', async () => {
    expect.hasAssertions();
    jest.spyOn(service, 'put').mockReturnValue(
      from([
        createMock<AxiosResponse>({
          data: fakeEditBillingAccountPlatformResponse,
        }),
      ]),
    );

    const fakeEditBillingAccountRequest = convertCamelCaseToSnakeCase(
      fakeEditBillingAccountDto,
    );
    const result = await service.editBillingAccount(
      fakeEditBillingAccountRequest,
    );

    expect(service.put).toBeCalledWith(
      `/billing-accounts/${fakeEditBillingAccountRequest.id}`,
      {
        ...fakeEditBillingAccountRequest,
      },
      {
        headers: {
          Authorization: FAKE_TOKEN,
        },
      },
    );
    expect(result).toStrictEqual(fakeEditBillingAccountPlatformResponse);
  });
});

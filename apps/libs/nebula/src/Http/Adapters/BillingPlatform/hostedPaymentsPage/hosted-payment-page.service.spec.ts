import nock from 'nock';

import { ConfigService } from '@nestjs/config';

import { MockerBuilder } from '@libs/nebula/testing/mocker/mocker.builder';
import {
  FAKE_OBJECT_ID,
  FAKE_TOKEN,
} from '@libs/nebula/testing/data/constants';
import { BpHostedPaymentsPageConfig } from '@libs/nebula/Config/schemas/bp-hosted-payments-page.schema';
import Errors from '@libs/nebula/Error';
import { BPHppTokenResponseDto } from '@libs/nebula/dto/billing-account/bp-hpp-token-response.dto';
import { faker } from '@libs/nebula/testing/data/fakers';
import { BillingProfileUuidDto } from '@libs/nebula/dto/billing-account/billing-profile-uuid.dto';
import { pathJoin } from '@libs/nebula/utils/data/pathJoin';

import { BPHostedPaymentPageService } from './hosted-payment-page.service';
import {
  HppTokenResponseData,
  REST_BP_HPP_PAYMENT_METHOD_PATH,
} from './constants';

describe('BPHostedPaymentPageService', () => {
  let authBody;
  let scope: nock.Scope;
  let configService: ConfigService<BpHostedPaymentsPageConfig, true>;
  let bPHostedPaymentPageService: BPHostedPaymentPageService;
  const tokenResponseData: HppTokenResponseData = {
    accessToken: { content: FAKE_TOKEN, expiry: 3600 },
    refreshToken: { content: FAKE_TOKEN, expiry: 3600 },
  };
  const fakeBillingProfileUuidDto = faker(BillingProfileUuidDto);

  const bpHostedPaymentsPageConfig: BpHostedPaymentsPageConfig = {
    BP_HPP_BASE_URL: 'http://localhost:8080',
    BP_HPP_ENV_ID: 'env_id',
    BP_HPP_CLIENT_ID: 'client_id',
    BP_HPP_CLIENT_SECRET: 'client_secret',
  };
  const apiUrl = bpHostedPaymentsPageConfig.BP_HPP_BASE_URL;

  const fakeBPHppTokenResponseDto = faker(BPHppTokenResponseDto);

  beforeEach(async () => {
    scope = nock(apiUrl);
    configService = MockerBuilder.mockConfigService({
      ...bpHostedPaymentsPageConfig,
    });
    bPHostedPaymentPageService = new BPHostedPaymentPageService(configService);
    authBody = {
      clientId: `${configService.get('BP_HPP_CLIENT_ID')}`,
      secret: `${configService.get('BP_HPP_CLIENT_SECRET')}`,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
    nock.cleanAll();
  });

  describe('fetchToken', () => {
    it('should fetch a new token if the token is not set', async () => {
      scope.post('/authenticate', authBody).reply(200, tokenResponseData);

      const token = await bPHostedPaymentPageService.getToken();

      expect(token).toEqual(fakeBPHppTokenResponseDto);
      expect(scope.isDone()).toBe(true);
    });

    it('should not call fetchNewToken when the token is already set', async () => {
      scope
        .post('/authenticate', authBody)
        .once()
        .reply(200, {
          accessToken: {
            content: FAKE_TOKEN,
            expiry: Date.now() / 1000 + 60 * 60,
          },
        });

      const token1 = await bPHostedPaymentPageService.getToken();

      const token2 = await bPHostedPaymentPageService.getToken();

      expect(token1).toStrictEqual(token2);
      expect(scope.isDone()).toBe(true);
    });

    it('should throw FailedToFetchToken error when BP request fails', async () => {
      scope.post('/authenticate', authBody).reply(500);

      await expect(bPHostedPaymentPageService.getToken()).rejects.toThrow(
        Errors.FailedToFetchToken,
      );
    });

    it('should fetch token again if token is expired', async () => {
      const now = new Date();
      bPHostedPaymentPageService['tokenExpirationTime'] = new Date(
        now.getTime() - 24 * 60 * 60 * 1000,
      );

      scope.post('/authenticate', authBody).reply(200, tokenResponseData);

      const token = await bPHostedPaymentPageService.getToken();

      expect(token).toEqual(fakeBPHppTokenResponseDto);
      expect(scope.isDone()).toBe(true);
    });
  });

  describe('deleteCard', () => {
    it('should delete a card successfully', async () => {
      scope.post('/authenticate', authBody).reply(200, tokenResponseData);
      scope
        .delete(
          `${pathJoin(REST_BP_HPP_PAYMENT_METHOD_PATH)}/?billingProfileId=${
            fakeBillingProfileUuidDto.billingProfileUuid
          }&paymentMethodId=${FAKE_OBJECT_ID}`,
        )
        .reply(200);

      await expect(
        bPHostedPaymentPageService.deleteCard(
          fakeBillingProfileUuidDto.billingProfileUuid,
          FAKE_OBJECT_ID,
        ),
      ).resolves.not.toThrow();
      expect(scope.isDone()).toBe(true);
    });

    it('should throw an error if unable to fetch token', async () => {
      scope.post('/authenticate', authBody).reply(500);

      await expect(
        bPHostedPaymentPageService.deleteCard(
          fakeBillingProfileUuidDto.billingProfileUuid,
          FAKE_OBJECT_ID,
        ),
      ).rejects.toThrow(Errors.FailedToFetchToken);
      expect(scope.isDone()).toBe(true);
    });

    it('should throw an error if delete request fails', async () => {
      scope.post('/authenticate', authBody).reply(200, tokenResponseData);
      scope
        .delete(
          `${pathJoin(REST_BP_HPP_PAYMENT_METHOD_PATH)}/?billingProfileId=${
            fakeBillingProfileUuidDto.billingProfileUuid
          }&paymentMethodId=${FAKE_OBJECT_ID}`,
        )
        .reply(500);

      await expect(
        bPHostedPaymentPageService.deleteCard(
          fakeBillingProfileUuidDto.billingProfileUuid,
          FAKE_OBJECT_ID,
        ),
      ).rejects.toThrow(Errors.BpDeleteCardFailed);
      expect(scope.isDone()).toBe(true);
    });
  });
});

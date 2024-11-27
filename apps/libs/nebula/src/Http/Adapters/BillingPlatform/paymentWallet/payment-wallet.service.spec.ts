import { from, throwError } from 'rxjs';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { AxiosResponse } from 'axios';

import { ConfigService } from '@nestjs/config';

import { MockerBuilder } from '@libs/nebula/testing/mocker/mocker.builder';
import { faker } from '@libs/nebula/testing/data/fakers';
import {
  FAKE_BP_BILLING_PROFILE_RESPONSE,
  FAKE_BP_BILLING_WALLET_RESPONSE,
  FAKE_TOKEN,
} from '@libs/nebula/testing/data/constants';
import { BpPaymentWalletConfig } from '@libs/nebula/Config/schemas/bp-payment-wallet.schema';
import { BillingProfileUuidDto } from '@libs/nebula/dto/billing-account/billing-profile-uuid.dto';
import { BillingProfileIdDto } from '@libs/nebula/dto/billing-account/billing-profile-id.dto';
import { BPWalletInfoResponseDto } from '@libs/nebula/dto/billing-account/bp-wallet-info-response.dto';

import { BPPaymentWalletTokenService } from './bp-token.service';
import { BPPaymentWalletService } from './payment-wallet.service';

describe('BPPaymentWalletService', () => {
  let service: BPPaymentWalletService;
  let configService: ConfigService<BpPaymentWalletConfig, true>;
  let tokenService: DeepMocked<BPPaymentWalletTokenService>;
  const fakeBillingProfileUuidDto = faker(BillingProfileUuidDto);
  const fakeBillingProfileIdDto = faker(BillingProfileIdDto);
  const fakeBPWalletInfoResponseDto = faker(BPWalletInfoResponseDto);

  const bpPaymentWalletConfig: BpPaymentWalletConfig = {
    BILLING_PLATFORM_URL: 'http://localhost:8080',
    BILLING_PLATFORM_AUTH_CLIENT_ID: 'client_id',
    BILLING_PLATFORM_AUTH_CLIENT_SECRET: 'client_secret',
    BILLING_PLATFORM_AUTH_GRANT_TYPE: 'grant_type',
  };

  let getTokenSpy;

  beforeEach(async () => {
    configService = MockerBuilder.mockConfigService({
      ...bpPaymentWalletConfig,
    });
    tokenService = createMock<BPPaymentWalletTokenService>();
    service = new BPPaymentWalletService(configService, tokenService);
    getTokenSpy = tokenService.getToken.mockResolvedValue(FAKE_TOKEN);
  });

  describe('getBillingProfile', () => {
    it('should call get billing profile API and return response', async () => {
      expect.hasAssertions();
      jest.spyOn(service, 'post').mockReturnValue(
        from([
          createMock<AxiosResponse>({
            data: FAKE_BP_BILLING_PROFILE_RESPONSE,
          }),
        ]),
      );

      const result = await service.getBillingProfile(fakeBillingProfileUuidDto);

      expect(result).toStrictEqual(FAKE_BP_BILLING_PROFILE_RESPONSE);
      expect(service.post).toBeCalledWith(
        expect.stringContaining('/rest/2.0/query'),
        {},
        {
          headers: {
            Authorization: FAKE_TOKEN,
          },
        },
      );
    });

    it('should handle BP error for getBillingProfile', async () => {
      expect.hasAssertions();
      jest
        .spyOn(service, 'post')
        .mockReturnValueOnce(throwError(() => new Error('Error from BP')));

      await expect(
        service.getBillingProfile(fakeBillingProfileUuidDto),
      ).rejects.toThrow('Error from BP');
    });
  });

  describe('getWalletDetails', () => {
    it('should call get billing wallet API and return response', async () => {
      expect.hasAssertions();
      jest.spyOn(service, 'get').mockReturnValue(
        from([
          createMock<AxiosResponse>({
            data: FAKE_BP_BILLING_WALLET_RESPONSE,
          }),
        ]),
      );

      const result = await service.getWalletDetails(fakeBillingProfileIdDto);

      expect(result.metadata).toEqual(fakeBPWalletInfoResponseDto.metadata);
      expect(result.items).toHaveLength(
        fakeBPWalletInfoResponseDto.items.length,
      );
      expect(result.items[0]).toEqual(fakeBPWalletInfoResponseDto.items[0]);

      expect(service.get).toBeCalledWith(
        expect.stringContaining('/rest/2.0/wallet'),
        {
          headers: {
            Authorization: FAKE_TOKEN,
          },
        },
      );
    });

    it('should handle invalid billing profile ID for getWalletDetails', async () => {
      expect.hasAssertions();
      jest
        .spyOn(service, 'get')
        .mockReturnValueOnce(
          throwError(() => new Error('Invalid Billing Profile ID')),
        );

      await expect(
        service.getWalletDetails({ billingProfileId: 'invalid_id' }),
      ).rejects.toThrow('Invalid Billing Profile ID');
    });

    it('should handle BP error for getWalletDetails', async () => {
      expect.hasAssertions();
      jest
        .spyOn(service, 'get')
        .mockReturnValueOnce(throwError(() => new Error('Error from BP')));

      await expect(
        service.getWalletDetails(fakeBillingProfileIdDto),
      ).rejects.toThrow('Error from BP');
    });
  });
});

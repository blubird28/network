import { lastValueFrom, map } from 'rxjs';
import { AxiosResponse } from 'axios';

import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';

import { AxiosLoggerInterceptor } from '@libs/nebula/Http/interceptors/axios-logger.interceptor';
import { AttachTracerInterceptor } from '@libs/nebula/Http/interceptors/attach-tracer.interceptor';
import convertSnakeCaseToCamelCase from '@libs/nebula/utils/data/convertSnakeCaseToCamelCase';
import { BpPaymentWalletConfig } from '@libs/nebula/Config/schemas/bp-payment-wallet.schema';
import { pathJoin } from '@libs/nebula/utils/data/pathJoin';
import { BillingProfileUuidDto } from '@libs/nebula/dto/billing-account/billing-profile-uuid.dto';
import { BillingProfileIdDto } from '@libs/nebula/dto/billing-account/billing-profile-id.dto';
import {
  BPWalletInfoResponseDto,
  BPWalletInfoResponseItemDto,
  BPWalletInfoResponseMetadataItemDto,
} from '@libs/nebula/dto/billing-account/bp-wallet-info-response.dto';

import { createAxiosInstance } from '../../axios-instance';

import { BPPaymentWalletTokenService } from './bp-token.service';
import {
  REST_BILLING_PLATFORM_PATH,
  REST_BILLING_PLATFORM_QUERY_PATH,
  REST_BILLING_PLATFORM_WALLET_PATH,
} from './constants';

@Injectable()
export class BPPaymentWalletService extends HttpService {
  private readonly logger: Logger = new Logger(BPPaymentWalletService.name);
  private readonly axiosLogger = new AxiosLoggerInterceptor(this.logger);
  private readonly attachTracer = new AttachTracerInterceptor(this.logger);

  constructor(
    @Inject(ConfigService)
    configService: ConfigService<BpPaymentWalletConfig, true>,
    private readonly bPPaymentWalletTokenService: BPPaymentWalletTokenService,
  ) {
    const billingPlatformBaseURL = configService.get('BILLING_PLATFORM_URL');
    const axiosConfig = { baseURL: billingPlatformBaseURL };
    const axiosInstance = createAxiosInstance(axiosConfig);
    super(axiosInstance);

    this.axiosLogger.attach(this.axiosRef);
    this.attachTracer.attach(this.axiosRef);
  }

  async getAuthorizationHeader() {
    return {
      Authorization: await this.bPPaymentWalletTokenService.getToken(),
    };
  }

  async getBillingProfile(
    billingProfileUuidDto: BillingProfileUuidDto,
    transactionId?: string,
  ) {
    const headers = await this.getAuthorizationHeader();
    if (transactionId) {
      headers['x-transaction-id'] = transactionId;
    }

    const params = new URLSearchParams({
      sql: `select bp.id from billing_profile bp where bp.hostedPaymentPageExternalId = '${billingProfileUuidDto.billingProfileUuid}'`,
    });
    const urlWithParams = `${pathJoin(
      `${REST_BILLING_PLATFORM_PATH}`,
      `${REST_BILLING_PLATFORM_QUERY_PATH}`,
    )}?${params}`;

    return lastValueFrom(
      this.post(urlWithParams, {}, { headers }).pipe(
        map(({ data }: AxiosResponse) => convertSnakeCaseToCamelCase(data)),
      ),
    );
  }

  async getWalletDetails(
    { billingProfileId }: BillingProfileIdDto,
    transactionId?: string,
  ): Promise<BPWalletInfoResponseDto> {
    const headers = await this.getAuthorizationHeader();

    if (transactionId) {
      headers['x-transaction-id'] = transactionId;
    }

    const params = new URLSearchParams({
      queryAnsiSql: `BillingProfileId = ${billingProfileId}`,
    });
    const urlWithParams = `${pathJoin(
      `${REST_BILLING_PLATFORM_PATH}`,
      `${REST_BILLING_PLATFORM_WALLET_PATH}`,
    )}?${params}`;

    const response = await lastValueFrom(
      this.get(urlWithParams, { headers }).pipe(
        map(({ data }: AxiosResponse) => convertSnakeCaseToCamelCase(data)),
      ),
    );

    // Remove the first entry from billingWalletInfo since it's metadata.
    const metadata: BPWalletInfoResponseMetadataItemDto =
      response.retrieveResponse[0];
    const items: BPWalletInfoResponseItemDto[] =
      response.retrieveResponse.slice(1);

    const walletInfoResponseDto: BPWalletInfoResponseDto = {
      metadata,
      items,
    };
    return walletInfoResponseDto;
  }
}

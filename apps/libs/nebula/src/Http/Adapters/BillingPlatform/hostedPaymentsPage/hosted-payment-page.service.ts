import { lastValueFrom } from 'rxjs';

import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';

import { pathJoin } from '@libs/nebula/utils/data/pathJoin';
import Errors from '@libs/nebula/Error';
import { BpHostedPaymentsPageConfig } from '@libs/nebula/Config/schemas/bp-hosted-payments-page.schema';
import { BPHppTokenResponseDto } from '@libs/nebula/dto/billing-account/bp-hpp-token-response.dto';
import entityToDto from '@libs/nebula/utils/data/entityToDto';
import { BPDeleteCardResponseDto } from '@libs/nebula/dto/billing-account/bp-delete-card-response.dto';
import { serializeResponse } from '@libs/nebula/Http/utils/serializeResponse';
import zeroOrMore from '@libs/nebula/utils/data/zeroOrMore';

import { AxiosLoggerInterceptor } from '../../../interceptors/axios-logger.interceptor';
import { AttachTracerInterceptor } from '../../../interceptors/attach-tracer.interceptor';
import { createAxiosInstance } from '../../axios-instance';

import {
  REST_BP_HPP_AUTH_PATH,
  HppTokenResponseData,
  HppTokenRequestBody,
  BUFFER_TIME,
  REST_BP_HPP_PAYMENT_METHOD_PATH,
} from './constants';

@Injectable()
export class BPHostedPaymentPageService extends HttpService {
  private readonly logger: Logger = new Logger(BPHostedPaymentPageService.name);
  private readonly axiosLogger = new AxiosLoggerInterceptor(this.logger);
  private readonly attachTracer = new AttachTracerInterceptor(this.logger);
  private token: string;
  private tokenExpirationTime: Date;

  constructor(
    @Inject(ConfigService)
    private readonly configService: ConfigService<
      BpHostedPaymentsPageConfig,
      true
    >,
  ) {
    const baseURL = `${configService.get('BP_HPP_BASE_URL')}`;
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      environmentId: `${configService.get('BP_HPP_ENV_ID')}`,
    };
    const axiosConfig = { baseURL, headers };
    const axiosInstance = createAxiosInstance(axiosConfig);
    super(axiosInstance);

    this.axiosLogger.attach(this.axiosRef);
    this.attachTracer.attach(this.axiosRef);
  }

  async getToken(): Promise<BPHppTokenResponseDto> {
    if (!this.token || this.isTokenExpired()) {
      await this.fetchNewToken();
    }
    return entityToDto(
      {
        accessToken: this.token,
      },
      BPHppTokenResponseDto,
    );
  }

  isTokenExpired(): boolean {
    if (!this.tokenExpirationTime) {
      return true;
    }
    const now = new Date();
    return now >= this.tokenExpirationTime;
  }

  setToken(data: HppTokenResponseData): void {
    const { content, expiry } = data.accessToken;
    this.token = content;
    this.tokenExpirationTime = new Date((expiry - BUFFER_TIME) * 1000);
  }

  async fetchNewToken(): Promise<HppTokenResponseData> {
    try {
      const requestBody: HppTokenRequestBody = {
        clientId: `${this.configService.get('BP_HPP_CLIENT_ID')}`,
        secret: `${this.configService.get('BP_HPP_CLIENT_SECRET')}`,
      };
      const response = await lastValueFrom(
        this.post(pathJoin(REST_BP_HPP_AUTH_PATH), requestBody),
      );

      this.setToken(response.data);
      return response.data;
    } catch (error) {
      this.logger.log('Failed to fetch HPP token:', error);
      throw new Errors.FailedToFetchToken();
    }
  }

  async getAuthorizationHeader() {
    const hppTokenResponse = await this.getToken();
    return {
      Authorization: `Bearer ${hppTokenResponse.accessToken}`,
    };
  }

  async deleteCard(
    bpHppUuid: string,
    cardId: string,
  ): Promise<BPDeleteCardResponseDto[]> {
    const headers = await this.getAuthorizationHeader();
    try {
      const params = {
        billingProfileId: bpHppUuid,
        paymentMethodId: cardId,
      };

      return await lastValueFrom(
        this.delete(REST_BP_HPP_PAYMENT_METHOD_PATH, { headers, params }).pipe(
          serializeResponse(BPDeleteCardResponseDto, (results) =>
            zeroOrMore(results)
              .flat()
              .map((item) => ({
                ...item,
                cardId,
              })),
          ),
        ),
      );
    } catch (error) {
      this.logger.log('Failed to delete card:', error);
      throw new Errors.BpDeleteCardFailed();
    }
  }
}

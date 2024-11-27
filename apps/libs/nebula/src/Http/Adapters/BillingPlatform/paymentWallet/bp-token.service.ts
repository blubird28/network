import { lastValueFrom } from 'rxjs';

import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';

import { pathJoin } from '@libs/nebula/utils/data/pathJoin';
import Errors from '@libs/nebula/Error';
import { BpPaymentWalletConfig } from '@libs/nebula/Config/schemas/bp-payment-wallet.schema';

import { AxiosLoggerInterceptor } from '../../../interceptors/axios-logger.interceptor';
import { AttachTracerInterceptor } from '../../../interceptors/attach-tracer.interceptor';
import { createAxiosInstance } from '../../axios-instance';

import {
  REST_BILLING_PLATFORM_AUTH_PATH,
  PaymentWalletTokenResponseData,
} from './constants';

@Injectable()
export class BPPaymentWalletTokenService extends HttpService {
  private readonly logger: Logger = new Logger(
    BPPaymentWalletTokenService.name,
  );
  private readonly axiosLogger = new AxiosLoggerInterceptor(this.logger);
  private readonly attachTracer = new AttachTracerInterceptor(this.logger);
  private token: string;
  private tokenExpirationTime: Date;

  constructor(
    @Inject(ConfigService)
    private readonly configService: ConfigService<BpPaymentWalletConfig, true>,
  ) {
    const billingPlatformBaseURL = configService.get('BILLING_PLATFORM_URL');
    const axiosConfig = { baseURL: billingPlatformBaseURL };
    const axiosInstance = createAxiosInstance(axiosConfig);
    super(axiosInstance);

    this.axiosLogger.attach(this.axiosRef);
    this.attachTracer.attach(this.axiosRef);
  }

  async getToken(): Promise<string> {
    if (!this.token || this.isTokenExpired()) {
      await this.fetchNewToken();
    }
    return this.token;
  }

  isTokenExpired(): boolean {
    if (!this.tokenExpirationTime) {
      return true;
    }
    const now = new Date();
    return now >= this.tokenExpirationTime;
  }

  setToken(data: PaymentWalletTokenResponseData): void {
    const { access_token, expires_in } = data;
    this.token = `Bearer ${access_token}`;
    const now = new Date();
    this.tokenExpirationTime = new Date(now.getTime() + expires_in * 1000);
  }

  async fetchNewToken(): Promise<void> {
    try {
      const requestQueryParams = new URLSearchParams({
        client_id: `${this.configService.get(
          'BILLING_PLATFORM_AUTH_CLIENT_ID',
        )}`,
        client_secret: `${this.configService.get(
          'BILLING_PLATFORM_AUTH_CLIENT_SECRET',
        )}`,
        grant_type: `${this.configService.get(
          'BILLING_PLATFORM_AUTH_GRANT_TYPE',
        )}`,
      }).toString();

      const urlWithParams = `${pathJoin(
        REST_BILLING_PLATFORM_AUTH_PATH,
      )}?${requestQueryParams}`;

      const response = await lastValueFrom(this.post(urlWithParams));
      this.setToken(response.data);
    } catch (error) {
      throw new Errors.FailedToFetchToken();
    }
  }
}

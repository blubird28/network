import { lastValueFrom } from 'rxjs';

import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';

import { pathJoin } from '@libs/nebula/utils/data/pathJoin';
import Errors from '@libs/nebula/Error';
import { BillingPlatformConfig } from '@libs/nebula/Config/schemas/billing-platform.schema';

import { AxiosLoggerInterceptor } from '../../interceptors/axios-logger.interceptor';
import { AttachTracerInterceptor } from '../../interceptors/attach-tracer.interceptor';
import { createAxiosInstance } from '../axios-instance';

import { REST_BP_AUTH_PATH, TokenData, TokenRequestBody } from './constants';

@Injectable()
export class TokenService extends HttpService {
  private readonly logger: Logger = new Logger(TokenService.name);
  private readonly axiosLogger = new AxiosLoggerInterceptor(this.logger);
  private readonly attachTracer = new AttachTracerInterceptor(this.logger);
  private token: string;
  private tokenExpirationTime: Date;

  constructor(
    @Inject(ConfigService)
    private readonly configService: ConfigService<BillingPlatformConfig, true>,
  ) {
    const baseURL = `${configService.get('BP_AUTH_URL')}`;
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    const axiosConfig = { baseURL, headers };
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

  setToken(data: TokenData): void {
    const { access_token, expires_in } = data;
    this.token = `Bearer ${access_token}`;
    const now = new Date();
    this.tokenExpirationTime = new Date(now.getTime() + expires_in * 1000);
  }

  async fetchNewToken(): Promise<void> {
    try {
      const requestBody: TokenRequestBody = {
        system_id: `${this.configService.get('BP_AUTH_SYSTEM_ID')}`,
        client_id: `${this.configService.get('BP_AUTH_CLIENT_ID')}`,
        client_secret: `${this.configService.get('BP_AUTH_CLIENT_SECRET')}`,
        grant_type: `${this.configService.get('BP_AUTH_GRANT_TYPE')}`,
        audience: `${this.configService.get('BP_AUTH_AUDIENCE')}`,
      };
      const response = await lastValueFrom(
        this.post(pathJoin(REST_BP_AUTH_PATH), requestBody),
      );
      this.setToken(response.data);
    } catch (error) {
      throw new Errors.FailedToFetchToken();
    }
  }
}

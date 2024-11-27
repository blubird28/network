import Axios from 'axios';

import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AxiosLoggerInterceptor } from '@libs/nebula/Http/interceptors/axios-logger.interceptor';
import { BaseConfig } from '@libs/nebula/Config/schemas/base.schema';
import { BearerTokenInterceptor } from '@libs/nebula/Http/interceptors/bearer-token.interceptor';
import {
  ExpiryFormat,
  TokenFetcherService,
} from '@libs/nebula/Http/services/token-fetcher.service';

import { OdpHttpConfig } from '../config/schemas/odp-http.schema';

type RequiredConfig = BaseConfig & OdpHttpConfig;

@Injectable()
export class OdpHttpService extends HttpService implements OnModuleInit {
  private readonly logger: Logger = new Logger(OdpHttpService.name);
  private readonly axiosLogger = new AxiosLoggerInterceptor(this.logger);
  // public readonly sixConnect = new SixconnectHttpService(this.axiosRef);
  private readonly tokenService: TokenFetcherService;
  private readonly auth: BearerTokenInterceptor;

  constructor(
    @Inject(ConfigService) configService: ConfigService<RequiredConfig, true>,
  ) {
    const baseURL = configService.get('ODP_API_BASE_URL');
    const clientKey = configService.get('ODP_API_CLIENT_KEY');
    const clientSecret = configService.get('ODP_API_CLIENT_SECRET');
    super(
      Axios.create({
        baseURL,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    );

    this.tokenService = new TokenFetcherService({
      request: {
        baseURL,
        auth: {
          username: clientKey,
          password: clientSecret,
        },
        method: 'POST',
        url: '/token',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        params: {
          grant_type: 'client_credentials',
        },
      },
      tokenKey: 'access_token',
      expireEarly: 30,
      expiryKey: 'expires_in',
      expiryFormat: ExpiryFormat.LIFETIME_SECONDS,
    });

    this.auth = new BearerTokenInterceptor({
      logger: this.logger,
      tokenService: this.tokenService,
    });

    this.axiosLogger.attach(this.axiosRef);
    this.auth.attach(this.axiosRef);
  }

  public getAxiosInstance() {
    return this.axiosRef;
  }

  async onModuleInit() {
    // Prefetch a token on startup to ensure the integration is working and be prepared for the first request
    try {
      await this.tokenService.fetchAndUpdateToken();
    } catch (err) {
      this.logger.error('Failed to fetch an ODP token on module init');
    }
  }
}

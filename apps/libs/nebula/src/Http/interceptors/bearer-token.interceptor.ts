import { AxiosInstance, AxiosRequestConfig } from 'axios';
import { isString } from 'lodash';

import { Logger } from '@nestjs/common';

import { TokenFetcher } from '@libs/nebula/Http/services/token-fetcher.service';

export interface BearerTokenInterceptorOptions {
  // The service responsible for returning a token (and any caching etc required)
  tokenService: TokenFetcher;
  logger?: Logger | string;
}

export class BearerTokenInterceptor {
  private readonly tokenService: TokenFetcher;
  private readonly logger: Logger;

  constructor({
    logger = BearerTokenInterceptor.name,
    tokenService,
  }: BearerTokenInterceptorOptions) {
    this.tokenService = tokenService;
    this.logger = isString(logger) ? new Logger(logger) : logger;
  }

  attach(axios: AxiosInstance) {
    axios.interceptors.request.use(this.request.bind(this));
  }

  async request(original: AxiosRequestConfig): Promise<AxiosRequestConfig> {
    const token = await this.tokenService.getToken();
    if (!token || !isString(token)) {
      this.logger.error('Failed to get a valid token!');
      return original;
    }
    const { headers = {}, ...request } = original;
    return {
      ...request,
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
    };
  }
}

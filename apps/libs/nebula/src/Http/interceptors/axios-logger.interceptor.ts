import { GlobalLogConfig } from 'axios-logger/lib/common/types';
import {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import * as AxiosLogger from 'axios-logger';

import { Logger } from '@nestjs/common';

export class AxiosLoggerInterceptor {
  static readonly LOG_CONFIG: GlobalLogConfig = {
    params: true,
    data: false,
    prefixText: false,
  };
  constructor(private readonly logger: Logger) {}

  attach(axios: AxiosInstance) {
    axios.interceptors.request.use(
      this.requestLogger.bind(this),
      this.errorLogger.bind(this),
    );
    axios.interceptors.response.use(
      this.responseLogger.bind(this),
      this.errorLogger.bind(this),
    );
  }

  private requestLogger(request: AxiosRequestConfig): AxiosRequestConfig {
    return AxiosLogger.requestLogger(request, {
      ...AxiosLoggerInterceptor.LOG_CONFIG,
      logger: this.logger.log.bind(this.logger),
    });
  }

  private errorLogger(request: AxiosError): Promise<AxiosError> {
    return AxiosLogger.errorLogger(request, {
      ...AxiosLoggerInterceptor.LOG_CONFIG,
      data: true,
      logger: this.logger.error.bind(this.logger),
    });
  }

  private responseLogger(request: AxiosResponse): AxiosResponse {
    return AxiosLogger.responseLogger(request, {
      ...AxiosLoggerInterceptor.LOG_CONFIG,
      logger: this.logger.verbose.bind(this.logger),
    });
  }
}

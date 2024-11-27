import Axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import * as AxiosLogger from 'axios-logger';
import { GlobalLogConfig } from 'axios-logger/lib/common/types';

import { HttpService } from '@nestjs/axios';
import { Inject, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { BaseConfig } from '../Config/schemas/base.schema';
import { SlackHookConfig } from '../Config/schemas/slack-hook.schema';

type RequiredConfig = BaseConfig & SlackHookConfig;

export class SlackHookService extends HttpService {
  static readonly LOG_CONFIG: GlobalLogConfig = {
    params: true,
    data: false,
    prefixText: false,
  };
  private readonly logger: Logger = new Logger(SlackHookService.name);
  constructor(
    @Inject(ConfigService)
    private readonly configService: ConfigService<RequiredConfig, true>,
  ) {
    super(
      Axios.create({
        baseURL: configService.get('SLACK_BASE_URL'),
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    );

    this.axiosRef.interceptors.request.use(
      this.requestLogger.bind(this),
      this.errorLogger.bind(this),
    );
    this.axiosRef.interceptors.response.use(
      this.responseLogger.bind(this),
      this.errorLogger.bind(this),
    );
  }

  private requestLogger(request: AxiosRequestConfig): AxiosRequestConfig {
    return AxiosLogger.requestLogger(request, {
      ...SlackHookService.LOG_CONFIG,
      logger: this.logger.verbose.bind(this.logger),
    });
  }

  private errorLogger(request: AxiosError): Promise<AxiosError> {
    return AxiosLogger.errorLogger(request, {
      ...SlackHookService.LOG_CONFIG,
      data: true,
      logger: this.logger.error.bind(this.logger),
    });
  }

  private responseLogger(request: AxiosResponse): AxiosResponse {
    return AxiosLogger.responseLogger(request, {
      ...SlackHookService.LOG_CONFIG,
      logger: this.logger.verbose.bind(this.logger),
    });
  }

  sendLegacyMessage(
    path: string,
    pretext: string,
    text: string,
    color = this.configService.get('SLACK_HOOK_DEFAULT_COLOUR'),
  ) {
    return this.sendMessage(path, {
      attachments: [{ pretext, color, text }],
    });
  }

  sendMessage(path: string, data: object) {
    this.logger.log(`sendMessage is posting..`);
    return this.post(path, data);
  }
}

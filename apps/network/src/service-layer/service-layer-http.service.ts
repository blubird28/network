import { v4 as uuid } from 'uuid';
import Axios from 'axios';
import { lastValueFrom } from 'rxjs';

import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

import { ThrottleInterceptor } from '@libs/nebula/Http/interceptors/throttle.interceptor';
import { AxiosLoggerInterceptor } from '@libs/nebula/Http/interceptors/axios-logger.interceptor';
import { urlJoin } from '@libs/nebula/utils/data/urlJoin';
import { getTracer, UNTRACED } from '@libs/nebula/Tracer';

import { ServiceLayerConfig } from '../config/schemas/service-layer.schema';

import { SL_COMMAND_UPDATE_PREFIXSET } from './constants';

@Injectable()
export class ServiceLayerHttpService extends HttpService {
  private readonly logger: Logger = new Logger(ServiceLayerHttpService.name);
  private readonly throttle = new ThrottleInterceptor();
  private readonly axiosLogger = new AxiosLoggerInterceptor(this.logger);
  private readonly callbackUrlBase: string;

  constructor(
    @Inject(ConfigService)
    configService: ConfigService<ServiceLayerConfig, true>,
  ) {
    super(
      Axios.create({
        baseURL: configService.get('SERVICE_LAYER_URL'),
        headers: {
          Authorization: `bearer ${configService.get(
            'SERVICE_LAYER_AUTH_TOKEN',
          )}`,
          'Content-Type': 'application/json',
        },
        timeout: configService.get('SERVICE_LAYER_REQUEST_TIMEOUT_MS'),
      }),
    );
    this.throttle.attach(this.axiosRef);
    this.axiosLogger.attach(this.axiosRef);
    this.callbackUrlBase = configService.get('SERVICE_LAYER_CALLBACK_URL_BASE');
  }

  isSuccessCode(code?: number): boolean {
    return code && code >= HttpStatus.OK && code < HttpStatus.AMBIGUOUS;
  }

  async updatePrefixSet(
    asn: number,
    ipv4: string[],
    ipv6: string[],
    callbackPath: string,
  ): Promise<void> {
    await this.sendCommand(
      SL_COMMAND_UPDATE_PREFIXSET,
      {
        external_asn: asn,
        prefix_ipv4: ipv4,
        prefix_ipv6: ipv6,
      },
      this.getCallbackUrl(callbackPath),
    );
  }

  private sendCommand(
    command: string,
    args: Record<string, unknown>,
    replyTo: string,
  ) {
    return lastValueFrom(
      this.post('/', {
        headers: {
          reply_to: replyTo,
          transaction_id: this.getTransactionId(),
        },
        id: uuid(),
        command,
        command_args: args,
      }),
    );
  }

  private getTransactionId() {
    const tracer = getTracer();
    if (tracer === UNTRACED) {
      return uuid();
    }
    return tracer.getTransactionId();
  }

  private getCallbackUrl(path: string) {
    return urlJoin(this.callbackUrlBase, path);
  }
}

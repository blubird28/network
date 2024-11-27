import Axios, { AxiosResponse } from 'axios';
import { Observable, map } from 'rxjs';

import { HttpService } from '@nestjs/axios';
import { Inject, Logger, OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { pathJoin } from '@libs/nebula/utils/data/pathJoin';
import { REST_CALCULATE_PREFIX } from '@libs/nebula/pricing/pricing.constants';
import { CalculatePriceDto } from '@libs/nebula/dto/pricing/calculate-price.dto';
import { PriceResponseDto } from '@libs/nebula/dto/pricing/price-response.dto';

import { ThrottleInterceptor } from '../interceptors/throttle.interceptor';
import { AxiosLoggerInterceptor } from '../interceptors/axios-logger.interceptor';
import { BaseConfig } from '../../Config/schemas/base.schema';
import { PricingConfig } from '../../Config/schemas/pricing-service.schema';
import {
  PingableClient,
  PingableClientInterface,
} from '../../Ping/ping.decorators';
import { HeartbeatResponseDto } from '../../Heartbeat/interfaces/dto/heartbeat-response.dto';
import { serializeResponse } from '../utils/serializeResponse';
import { AttachTracerInterceptor } from '../interceptors/attach-tracer.interceptor';

type RequiredConfig = BaseConfig & PricingConfig;
@PingableClient('PRICING_SERVICE')
export class PricingHttpService
  extends HttpService
  implements OnApplicationShutdown, PingableClientInterface
{
  private readonly logger: Logger = new Logger(PricingHttpService.name);
  private readonly throttle = new ThrottleInterceptor();
  private readonly axiosLogger = new AxiosLoggerInterceptor(this.logger);
  private readonly attachTracer = new AttachTracerInterceptor(this.logger);

  constructor(
    @Inject(ConfigService) configService: ConfigService<RequiredConfig, true>,
  ) {
    super(
      Axios.create({
        baseURL: configService.get('PRICING_SERVICE_URL'),
        headers: {
          'user-agent': 'constellation-pricing-http-service',
        },
      }),
    );

    this.throttle.attach(this.axiosRef);
    this.axiosLogger.attach(this.axiosRef);
    this.attachTracer.attach(this.axiosRef);
  }

  onApplicationShutdown() {
    this.throttle.cleanup();
  }

  getClientHeartbeat(): Observable<HeartbeatResponseDto> {
    return this.get<HeartbeatResponseDto>('/heartbeat').pipe(
      serializeResponse(HeartbeatResponseDto),
    );
  }

  calculate(calculatePrice: CalculatePriceDto): Observable<PriceResponseDto> {
    return this.post(pathJoin(REST_CALCULATE_PREFIX), calculatePrice).pipe(
      map(({ data }: AxiosResponse) => data),
    );
  }
}

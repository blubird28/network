import Axios, { AxiosResponse } from 'axios';
import { Observable, map } from 'rxjs';

import { HttpService } from '@nestjs/axios';
import { Inject, Logger, OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import jsonStringify from '@libs/nebula/utils/data/jsonStringify';
import { SearchRequestDto } from '@libs/nebula/dto/search/search-request.dto';

import { ThrottleInterceptor } from '../interceptors/throttle.interceptor';
import { AxiosLoggerInterceptor } from '../interceptors/axios-logger.interceptor';
import { BaseConfig } from '../../Config/schemas/base.schema';
import { SearchServiceConfig } from '../../Config/schemas/search-service.schema';
import {
  PingableClient,
  PingableClientInterface,
} from '../../Ping/ping.decorators';
import { HeartbeatResponseDto } from '../../Heartbeat/interfaces/dto/heartbeat-response.dto';
import { serializeResponse } from '../utils/serializeResponse';
import { AttachTracerInterceptor } from '../interceptors/attach-tracer.interceptor';
import { SharedErrorInterceptor } from '../interceptors/shared-error.interceptor';

type RequiredConfig = BaseConfig & SearchServiceConfig;
@PingableClient('SEARCH_SERVICE')
export class SearchHttpService
  extends HttpService
  implements OnApplicationShutdown, PingableClientInterface
{
  private logger: Logger = new Logger(SearchHttpService.name);
  private throttle = new ThrottleInterceptor();
  private axiosLogger = new AxiosLoggerInterceptor(this.logger);
  private attachTracer = new AttachTracerInterceptor(this.logger);
  private readonly sharedErrorInterceptor = new SharedErrorInterceptor();

  constructor(
    @Inject(ConfigService) configService: ConfigService<RequiredConfig, true>,
  ) {
    super(
      Axios.create({
        baseURL: configService.get('SEARCH_SERVICE_URL'),
        headers: {
          'user-agent': 'constellation-search-http-service',
        },
      }),
    );

    this.throttle.attach(this.axiosRef);
    this.axiosLogger.attach(this.axiosRef);
    this.attachTracer.attach(this.axiosRef);
    this.sharedErrorInterceptor.attach(this.axiosRef);
  }

  onApplicationShutdown() {
    this.throttle.cleanup();
  }

  getClientHeartbeat(): Observable<HeartbeatResponseDto> {
    return this.get<HeartbeatResponseDto>('/heartbeat').pipe(
      serializeResponse(HeartbeatResponseDto),
    );
  }

  async performSearch(searchRequest: SearchRequestDto) {
    const results = this.get(
      searchRequest.domainSlug ? `/${searchRequest.domainSlug}` : '',
      {
        params: searchRequest.params,
      },
    ).pipe(map(({ data }: AxiosResponse) => data));
    this.logger.debug('Polaris recieved results from search');
    return results;
  }
}

import { AxiosInstance, AxiosRequestConfig } from 'axios';

import { Logger } from '@nestjs/common';

import { HTTP_HEADER } from '../../Tracer/constants';
import { getTracer, TracerInformation, UNTRACED } from '../../Tracer';

export class AttachTracerInterceptor {
  constructor(private readonly logger: Logger) {}

  attach(axios: AxiosInstance) {
    axios.interceptors.request.use(this.interceptRequest.bind(this));
  }

  private interceptRequest(request: AxiosRequestConfig): AxiosRequestConfig {
    const tracer = getTracer();
    if (tracer !== UNTRACED) {
      return this.attachTracerToRequest(request, tracer);
    }

    this.logger.warn(
      'Making a cross-service call in an untraced context. This is probably a background process that needs to be wrapped with withTracer(). The call will be made with no transaction id.',
    );
    return request;
  }

  private attachTracerToRequest(
    request: AxiosRequestConfig,
    tracer: TracerInformation,
  ) {
    return {
      ...request,
      headers: {
        ...(request.headers || {}),
        [HTTP_HEADER]: tracer.getTransactionId(),
      },
    };
  }
}

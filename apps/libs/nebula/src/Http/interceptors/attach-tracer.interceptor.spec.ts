import { AxiosInstance, AxiosRequestConfig } from 'axios';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { from, lastValueFrom } from 'rxjs';

import { Logger } from '@nestjs/common';

import { TracerInformation, withTracer } from '../../Tracer';
import { HTTP_HEADER } from '../../Tracer/constants';

import { AttachTracerInterceptor } from './attach-tracer.interceptor';

describe('Attach Tracer Interceptor', () => {
  let interceptor: AttachTracerInterceptor;
  let requestInterceptor: (r: AxiosRequestConfig) => AxiosRequestConfig;
  let fakeAxios: DeepMocked<AxiosInstance>;

  beforeEach(() => {
    interceptor = new AttachTracerInterceptor(createMock<Logger>());
    fakeAxios = createMock<AxiosInstance>({
      interceptors: createMock({
        request: createMock({
          use: (r) => (requestInterceptor = r),
        }),
      }),
    });
    interceptor.attach(fakeAxios);
  });

  it('attaches', () => {
    expect(fakeAxios.interceptors.request.use).toBeCalledWith(
      expect.any(Function),
    );
  });

  const inTracerContext = (run: () => Promise<unknown>) =>
    lastValueFrom(
      withTracer(
        new TracerInformation(
          'background',
          'expected-transaction-id',
          'pattern',
        ),
        () => from(run()),
      ),
    );

  it('when there is no headers, adds the header', async () => {
    await inTracerContext(async () => {
      expect(
        requestInterceptor(
          createMock<AxiosRequestConfig>({ headers: undefined }),
        ).headers,
      ).toStrictEqual({ [HTTP_HEADER]: 'expected-transaction-id' });
    });
  });

  it('when there is other headers, adds the header', async () => {
    await inTracerContext(async () => {
      expect(
        requestInterceptor(
          createMock<AxiosRequestConfig>({
            headers: {
              foo: 'bar',
            },
          }),
        ).headers,
      ).toStrictEqual({ [HTTP_HEADER]: 'expected-transaction-id', foo: 'bar' });
    });
  });

  it('if the header is already set, overrides it', async () => {
    await inTracerContext(async () => {
      expect(
        requestInterceptor(
          createMock<AxiosRequestConfig>({
            headers: { [HTTP_HEADER]: 'something-else' },
          }),
        ).headers,
      ).toStrictEqual({ [HTTP_HEADER]: 'expected-transaction-id' });
    });
  });

  it('if the process is not traced, does not modify headers', async () => {
    expect(
      requestInterceptor(
        createMock<AxiosRequestConfig>({
          headers: { [HTTP_HEADER]: 'something-else', foo: 'bar' },
        }),
      ).headers,
    ).toStrictEqual({ [HTTP_HEADER]: 'something-else', foo: 'bar' });
  });
});

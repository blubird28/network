import { AxiosInstance } from 'axios';
import { createMock } from '@golevelup/ts-jest';
import { noop } from 'lodash';

import { AxiosLoggerInterceptor } from './axios-logger.interceptor';

describe('Axios Logger Interceptor', () => {
  it('attaches', () => {
    const fakeAxios = createMock<AxiosInstance>({
      interceptors: createMock({
        request: createMock({
          use: noop,
        }),
        response: createMock({
          use: noop,
        }),
      }),
    });
    new AxiosLoggerInterceptor(createMock()).attach(fakeAxios);
    expect(fakeAxios.interceptors.request.use).toBeCalledWith(
      expect.any(Function),
      expect.any(Function),
    );
    expect(fakeAxios.interceptors.response.use).toBeCalledWith(
      expect.any(Function),
      expect.any(Function),
    );
  });
});

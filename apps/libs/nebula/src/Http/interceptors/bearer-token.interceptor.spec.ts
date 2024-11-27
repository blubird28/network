import { AxiosInstance, AxiosRequestConfig } from 'axios';
import { createMock } from '@golevelup/ts-jest';
import { noop } from 'lodash';

import { BearerTokenInterceptor } from '@libs/nebula/Http/interceptors/bearer-token.interceptor';

describe('Bearer Token Interceptor', () => {
  let interceptor: BearerTokenInterceptor;
  const getToken = jest.fn();
  const fakeRequest: AxiosRequestConfig = {
    url: 'https://fake/api/request',
    method: 'GET',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    getToken.mockReturnValue('token');
    interceptor = new BearerTokenInterceptor({ tokenService: { getToken } });
  });

  afterEach(() => {
    interceptor = null;
  });

  it('attaches', () => {
    const fakeAxios = createMock<AxiosInstance>({
      interceptors: createMock({
        request: createMock({
          use: noop,
        }),
      }),
    });
    interceptor.attach(fakeAxios);
    expect(fakeAxios.interceptors.request.use).toBeCalledWith(
      expect.any(Function),
    );
  });

  it('adds the token to the request', async () => {
    expect(await interceptor.request(fakeRequest)).toStrictEqual({
      ...fakeRequest,
      headers: {
        Authorization: 'Bearer token',
      },
    });
    expect(getToken).toBeCalledTimes(1);
  });

  it('does not modify the request if a valid token cannot be fetched', async () => {
    getToken.mockReturnValue(null);
    expect(await interceptor.request(fakeRequest)).toBe(fakeRequest);
    expect(getToken).toBeCalledTimes(1);
  });
});

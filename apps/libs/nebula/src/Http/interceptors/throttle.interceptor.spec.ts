import {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import { createMock } from '@golevelup/ts-jest';
import { noop, times } from 'lodash';

import { ThrottleInterceptor } from './throttle.interceptor';

describe('Axios Throttle Interceptor', () => {
  let interceptor: ThrottleInterceptor;
  const fakeRequest = createMock<AxiosRequestConfig>();
  const fakeResponse = createMock<AxiosResponse>();
  const fakeError = createMock<AxiosError>();
  const wait = (ms = 1) => new Promise<void>((r) => setTimeout(() => r(), ms));

  afterEach(() => {
    interceptor?.cleanup();
    interceptor = null;
  });

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
    interceptor = new ThrottleInterceptor();
    interceptor.attach(fakeAxios);
    expect(fakeAxios.interceptors.request.use).toBeCalledWith(
      expect.any(Function),
    );
    expect(fakeAxios.interceptors.response.use).toBeCalledWith(
      expect.any(Function),
      expect.any(Function),
    );
  });

  it('does not delay if the queue is empty', async () => {
    interceptor = new ThrottleInterceptor(1, 1000);
    expect(await interceptor.request(fakeRequest)).toBe(fakeRequest);
  }, 100);

  it('throttles and delays as the queue fills', async () => {
    interceptor = new ThrottleInterceptor(1, 1);
    const requestSent = jest.fn();
    interceptor.request(fakeRequest).then(requestSent);
    interceptor.request(fakeRequest).then(requestSent);
    interceptor.request(fakeRequest).then(requestSent);

    await wait();
    expect(requestSent).toHaveBeenCalledTimes(1);

    await wait(10);
    // Still only called once as no response yet
    expect(requestSent).toHaveBeenCalledTimes(1);
    expect(await interceptor.response(fakeResponse)).toBe(fakeResponse);

    await wait();
    expect(requestSent).toHaveBeenCalledTimes(2);
    // errors also drain the queue as normal
    await expect(interceptor.responseError(fakeError)).rejects.toBe(fakeError);

    await wait();
    expect(requestSent).toHaveBeenCalledTimes(3);
  });

  it('throttles and delays as the queue fills - longer queue', async () => {
    interceptor = new ThrottleInterceptor(3, 1);
    const requestSent = jest.fn();
    times(5, () => interceptor.request(fakeRequest).then(requestSent));

    await wait(10);
    expect(requestSent).toHaveBeenCalledTimes(3);
    expect(await interceptor.response(fakeResponse)).toBe(fakeResponse);
    times(3, () => interceptor.request(fakeRequest).then(requestSent));

    await wait(10);
    expect(requestSent).toHaveBeenCalledTimes(4);

    const responses = [5, 6, 7].map(() => interceptor.response(fakeResponse));

    await wait(10);
    expect(requestSent).toHaveBeenCalledTimes(7);
    expect(await interceptor.response(fakeResponse)).toBe(fakeResponse);

    await wait(10);
    expect(requestSent).toHaveBeenCalledTimes(8);

    await Promise.all(responses);
  });
});

import { AxiosRequestConfig } from 'axios';
import nock from 'nock';

import {
  ExpiryFormat,
  TokenFetcherService,
} from '@libs/nebula/Http/services/token-fetcher.service';
import { FIRST_JAN_2020 } from '@libs/nebula/testing/data/constants';
import { MINUTE_IN_SECONDS, SECOND_IN_MILLIS } from '@libs/nebula/basic-types';

describe('TokenFetcherService', () => {
  let service: TokenFetcherService;
  const loginRequest: AxiosRequestConfig = {
    baseURL: 'https://localhost:8282/',
    url: '/token',
    method: 'POST',
  };
  const now = FIRST_JAN_2020.getTime();
  const nowSeconds = now / SECOND_IN_MILLIS;
  const oneMinute = MINUTE_IN_SECONDS * SECOND_IN_MILLIS;
  const oneMinuteBefore = now - oneMinute;
  const oneMinuteAfter = now + oneMinute;
  const scope: nock.Scope = nock(loginRequest.baseURL);
  let interceptors: nock.Interceptor[] = [];
  const mockLogin = (token = 'token') => {
    const loginMock = scope
      .intercept(loginRequest.url, loginRequest.method)
      .times(1);
    loginMock.reply(200, {
      token,
      expiry: oneMinuteAfter,
    });
    interceptors.push(loginMock);
  };
  const fetchToken = () => {
    // Why? https://github.com/nock/nock/issues/2200
    // nock's override for node http relies on process.nextTick
    // Which never happens with jest.useFakeTimers on (without us manually making it happen)
    const tokenPromise = service.getToken();
    jest.runAllTicks();
    return tokenPromise;
  };

  beforeEach(() => {
    service = new TokenFetcherService({
      tokenKey: 'token',
      expiryKey: 'expiry',
      expiryFormat: ExpiryFormat.TIMESTAMP,
      expireEarly: 30,
      request: loginRequest,
    });

    jest.useFakeTimers('modern');
    jest.setSystemTime(now);
  });

  afterEach(() => {
    interceptors.forEach(nock.removeInterceptor);
    interceptors = [];
    jest.useRealTimers();
  });

  it('fetches a new token', async () => {
    expect.hasAssertions();

    mockLogin();

    expect(await fetchToken()).toBe('token');
    expect(scope.isDone()).toBe(true);
  });
  it('reuses a cached token if it has not expired', async () => {
    expect.hasAssertions();

    mockLogin();
    expect(await fetchToken()).toBe('token');
    expect(scope.isDone()).toBe(true);

    expect(await fetchToken()).toBe('token');
    expect(await fetchToken()).toBe('token');
    expect(await fetchToken()).toBe('token');
  });
  it('fetches a new token when the cached one has expired', async () => {
    expect.hasAssertions();

    mockLogin();
    expect(await fetchToken()).toBe('token');
    expect(scope.isDone()).toBe(true);

    jest.setSystemTime(oneMinuteAfter);

    mockLogin('new-token');
    expect(await fetchToken()).toBe('new-token');
    expect(scope.isDone()).toBe(true);
  });

  describe('expiry strategies', () => {
    it('handles expiry based on an exact json date', () => {
      expect.hasAssertions();

      expect(
        TokenFetcherService.EXPIRY_STRATEGIES.ISO(FIRST_JAN_2020.toJSON(), 0),
      ).toBe(now);
      expect(TokenFetcherService.EXPIRY_STRATEGIES.ISO(FIRST_JAN_2020, 0)).toBe(
        now,
      );
    });
    it('handles expiry based on an exact timestamp in milliseconds', () => {
      expect.hasAssertions();

      expect(TokenFetcherService.EXPIRY_STRATEGIES.TIMESTAMP(now, 0)).toBe(now);
      expect(TokenFetcherService.EXPIRY_STRATEGIES.TIMESTAMP(now, 0)).toBe(now);
    });
    it('handles expiry based on an exact timestamp in seconds', () => {
      expect.hasAssertions();

      expect(
        TokenFetcherService.EXPIRY_STRATEGIES.TIMESTAMP_SECONDS(nowSeconds, 0),
      ).toBe(now);
      expect(
        TokenFetcherService.EXPIRY_STRATEGIES.TIMESTAMP_SECONDS(
          String(nowSeconds),
          0,
        ),
      ).toBe(now);
    });
    it('handles expiry based on an lifetime in milliseconds relative to creation', () => {
      expect.hasAssertions();

      expect(
        TokenFetcherService.EXPIRY_STRATEGIES.LIFETIME_MILLIS(
          oneMinute,
          oneMinuteBefore,
        ),
      ).toBe(now);
      expect(
        TokenFetcherService.EXPIRY_STRATEGIES.LIFETIME_MILLIS(
          String(oneMinute),
          oneMinuteBefore,
        ),
      ).toBe(now);
    });
    it('handles expiry based on an lifetime in seconds relative to creation', () => {
      expect.hasAssertions();

      expect(
        TokenFetcherService.EXPIRY_STRATEGIES.LIFETIME_SECONDS(
          MINUTE_IN_SECONDS,
          oneMinuteBefore,
        ),
      ).toBe(now);
      expect(
        TokenFetcherService.EXPIRY_STRATEGIES.LIFETIME_SECONDS(
          MINUTE_IN_SECONDS,
          oneMinuteBefore,
        ),
      ).toBe(now);
    });
  });
});

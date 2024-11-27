import { firstValueFrom, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

import { ExecutionContext, CallHandler } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import Errors from '@libs/nebula/Error';

import { TimeoutInterceptor } from './timeout.interceptor';

describe('TimeoutInterceptor', () => {
  let interceptor: TimeoutInterceptor;
  let configService: ConfigService;
  const DELAY = 3000;
  const REQUEST_TIMEOUT = 2000;

  beforeEach(() => {
    configService = {
      get: jest.fn().mockReturnValue(REQUEST_TIMEOUT),
    } as unknown as ConfigService;
    interceptor = new TimeoutInterceptor(configService);
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should throw TimeoutError when request times out', async () => {
    expect.hasAssertions();

    const context = {} as ExecutionContext;
    const next = {
      handle: () => of('response').pipe(delay(DELAY)),
    } as CallHandler<any>;

    const result$ = interceptor.intercept(context, next);

    try {
      const result = await firstValueFrom(result$);
      expect(result).not.toBe('response');
    } catch (error) {
      expect(error instanceof Errors.Timeout).toBe(true);
    }
    expect.assertions(1);
  });

  it('should return the error as it is received from API before timeout', async () => {
    expect.hasAssertions();

    const context = {} as ExecutionContext;
    const errorMessage = 'Custom API request Error';
    const next = {
      handle: () => throwError(() => new Error(errorMessage)),
    } as CallHandler<any>;

    const result$ = interceptor.intercept(context, next);

    try {
      await firstValueFrom(result$);
    } catch (error) {
      expect(error.message).toBe(errorMessage);
    }
    expect.assertions(1);
  });

  it('should return the response if received within the timeout', async () => {
    expect.hasAssertions();
    const context = {} as ExecutionContext;
    const next = {
      handle: () => of('response'),
    } as CallHandler<any>;
    const result$ = interceptor.intercept(context, next);
    const result = await firstValueFrom(result$);
    expect(result).toBe('response');
    expect.assertions(1);
  });
});

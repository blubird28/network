import { Request, Response } from 'express';
import { createMock } from '@golevelup/ts-jest';
import { lastValueFrom } from 'rxjs';

import {
  ArgumentsHost,
  HttpException,
  NotFoundException,
} from '@nestjs/common';
import { ThrottlerException } from '@nestjs/throttler';

import { TracerInformation, withTracer, withTracerSync } from '../Tracer';

import { BaseExceptionFilter } from './BaseException.filter';

import Errors, { BaseException, ErrorCode } from '.';

describe('BaseExceptionFilter', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  let filter;

  beforeEach(() => {
    filter = new BaseExceptionFilter();
  });

  const data = { foo: 'bar' };
  const baseException = new BaseException(
    ErrorCode.ValidationFailed,
    418,
    data,
  );
  const subException = new Errors.InvalidUserId(data);
  const httpException = new HttpException('Computer says no', 409);
  const notFoundException = new NotFoundException('Not found');
  const throttlerException = new ThrottlerException('Too many requests.');
  const plainException = new Error('Computer says no');
  const baseExpectation = {
    status: 'error',
    code: ErrorCode.ValidationFailed,
    data,
    httpStatus: 418,
    message: `error.${ErrorCode.ValidationFailed}`,
    transactionId: 'transaction-id',
  };
  const subExpectation = {
    status: 'error',
    code: ErrorCode.InvalidUserId,
    data,
    httpStatus: 400,
    message: `error.${ErrorCode.InvalidUserId}`,
    transactionId: 'transaction-id',
  };
  const notFoundExpectation = {
    status: 'error',
    code: ErrorCode.NotFound,
    data: {},
    httpStatus: 404,
    message: `error.${ErrorCode.NotFound}`,
    transactionId: 'transaction-id',
  };
  const throttlerExpectation = {
    status: 'error',
    code: ErrorCode.TooManyRequests,
    data: {},
    httpStatus: 429,
    message: `error.${ErrorCode.TooManyRequests}`,
    transactionId: 'transaction-id',
  };
  const unknownExpectation = {
    status: 'error',
    code: ErrorCode.Unknown,
    data: {},
    httpStatus: 500,
    message: `error.${ErrorCode.Unknown}`,
    transactionId: 'transaction-id',
  };

  describe('in http context', () => {
    const test = (error) =>
      withTracerSync(
        new TracerInformation('http', 'transaction-id', 'pattern'),
        () => filter.catch(error, host),
      );
    let response;
    let request;
    let host;

    beforeEach(() => {
      response = createMock<Response>();
      response.json.mockReturnValue(response);
      response.status.mockReturnValue(response);
      request = createMock<Request>({
        i18nContext: { translate: jest.fn((i) => i) },
      } as any);
      host = createMock<ArgumentsHost>({
        getType: () => 'http',
        switchToHttp: () => ({
          getResponse: () => response,
          getRequest: () => request,
        }),
      });
    });

    it('handles our errors', async () => {
      test(baseException);

      expect(response.status).toBeCalledWith(418);
      expect(response.json).toBeCalledWith(baseExpectation);
    });

    it('handles subclasses of our errors', async () => {
      test(subException);

      expect(response.status).toBeCalledWith(400);
      expect(response.json).toBeCalledWith(subExpectation);
    });

    it('handles basic http errors', async () => {
      test(httpException);

      expect(response.status).toBeCalledWith(409);
      expect(response.json).toBeCalledWith({
        ...unknownExpectation,
        httpStatus: 409,
      });
    });

    it('converts anything else to unknown', async () => {
      test(plainException);

      expect(response.status).toBeCalledWith(500);
      expect(response.json).toBeCalledWith(unknownExpectation);
    });
  });

  describe('in rpc context', () => {
    let host;
    const test = (error) =>
      lastValueFrom(
        withTracer(
          new TracerInformation('rpc', 'transaction-id', 'pattern'),
          () => filter.catch(error, host),
        ),
      );

    beforeEach(() => {
      host = createMock<ArgumentsHost>({
        getType: () => 'rpc',
        switchToRpc: () => ({
          getContext: () => ({
            i18nContext: { translate: jest.fn((i) => i) },
          }),
        }),
      });
    });

    it('handles our errors', async () => {
      await expect(test(baseException)).rejects.toStrictEqual(baseExpectation);
    });

    it('handles subclasses of our errors', async () => {
      await expect(test(subException)).rejects.toStrictEqual(subExpectation);
    });

    it('handles basic http errors', async () => {
      await expect(test(httpException)).rejects.toStrictEqual({
        ...unknownExpectation,
        httpStatus: 409,
      });
    });

    it('handles not found errors', async () => {
      await expect(test(notFoundException)).rejects.toStrictEqual(
        notFoundExpectation,
      );
    });

    it('handles too many requests (rate limiting) errors', async () => {
      await expect(test(throttlerException)).rejects.toStrictEqual(
        throttlerExpectation,
      );
    });

    it('converts anything else to unknown', async () => {
      await expect(test(plainException)).rejects.toStrictEqual(
        unknownExpectation,
      );
    });
  });
});

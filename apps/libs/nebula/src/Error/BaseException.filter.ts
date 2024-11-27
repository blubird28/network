import { Response } from 'express';
import { Observable, throwError } from 'rxjs';

import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ThrottlerException } from '@nestjs/throttler';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';

import { BaseException, SharedError } from './BaseException';
import { ErrorCode } from './constants';

@Catch()
export class BaseExceptionFilter implements ExceptionFilter {
  private logger: Logger = new Logger(BaseExceptionFilter.name);

  http(host: HttpArgumentsHost, error: SharedError) {
    host
      .getResponse<Response>()
      .status(error.httpStatus)
      .json({ status: 'error', ...error });
  }

  rpc(error: SharedError): Observable<any> {
    return throwError(() => ({ status: 'error', ...error }));
  }

  getError(exception): BaseException {
    if (exception instanceof BaseException) {
      return exception;
    }

    this.logger.error(
      `Caught unexpected error: ${exception?.message || 'Unknown error'}`,
      exception?.stack,
    );

    if (exception instanceof NotFoundException) {
      return new BaseException(ErrorCode.NotFound, exception.getStatus());
    }

    if (exception instanceof ThrottlerException) {
      return new BaseException(
        ErrorCode.TooManyRequests,
        exception.getStatus(),
      );
    }

    if (exception instanceof HttpException) {
      return new BaseException(ErrorCode.Unknown, exception.getStatus());
    }

    return new BaseException();
  }

  catch(exception, host: ArgumentsHost) {
    const error = this.getError(exception);
    error.translateMessageWithContext(host);
    this.logger.error(error);
    const errorObj = error.toObject();
    switch (host.getType()) {
      case 'http':
        return this.http(host.switchToHttp(), errorObj);
      case 'rpc':
        return this.rpc(errorObj);
    }
  }
}

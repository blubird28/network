import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import Errors from '@libs/nebula/Error';
@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  constructor(private readonly configService: ConfigService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      timeout(this.configService.get('REQUEST_TIMEOUT')),
      catchError((error) => {
        if (error instanceof TimeoutError) {
          return throwError(() => new Errors.Timeout());
        }
        return throwError(() => error);
      }),
    );
  }
}

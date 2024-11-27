import { Observable, tap } from 'rxjs';

import {
  CallHandler,
  ExecutionContext,
  Logger,
  NestInterceptor,
} from '@nestjs/common';

export class TracerInterceptor implements NestInterceptor {
  private logger = new Logger();

  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> {
    this.logger.log('Received message');
    return next.handle().pipe(tap(() => this.logger.log('Request completed')));
  }
}

import { Observable, Subscription } from 'rxjs';
import { ClsServiceManager, ClsStore } from 'nestjs-cls';

import { ContextType } from '@nestjs/common';

import { TRACER_CLS_KEY } from './constants';

export type TracerType = ContextType | 'background' | 'task';

export class TracerInformation {
  constructor(
    private readonly type: TracerType,
    private readonly transactionId: string,
    private readonly pattern: string,
  ) {}
  getType(): TracerType {
    return this.type;
  }
  getTransactionId(): string {
    return this.transactionId;
  }
  getPattern(): string {
    return this.pattern;
  }
}

export interface ClsTracerInformation extends ClsStore {
  [TRACER_CLS_KEY]?: TracerInformation;
}

export const UNTRACED = new TracerInformation('background', '-', '-');

export const withTracer = <T>(
  tracer: TracerInformation,
  pointcut: () => Observable<T>,
): Observable<T> =>
  new Observable((subscriber) => {
    let subscription: Subscription | undefined;
    withTracerSync(tracer, () => {
      subscription = pointcut().subscribe(subscriber);
    });
    return () => subscription?.unsubscribe();
  });

export const withTracerSync = <T>(
  tracer: TracerInformation,
  callback: () => T,
): T => {
  const cls = ClsServiceManager.getClsService<ClsTracerInformation>();
  return cls.run(() => {
    cls.setIfUndefined(TRACER_CLS_KEY, tracer);
    return callback();
  });
};

export const getTracer = (): TracerInformation => {
  const cls = ClsServiceManager.getClsService<ClsTracerInformation>();
  return cls.get(TRACER_CLS_KEY) || UNTRACED;
};

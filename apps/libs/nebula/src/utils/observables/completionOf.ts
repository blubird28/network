import { lastValueFrom, Observable } from 'rxjs';

/*
 * Usage: const val = await completionOf(deferred);
 * If deferred is an observable, val is the last value it emits before completion
 * If deferred is a promise, val is the value it resolves with
 * Otherwise, val is exactly equal to deferred
 */
const completionOf = async <T = unknown>(
  promiseOrObservable: Promise<T> | Observable<T> | T,
): Promise<T> => {
  if (promiseOrObservable instanceof Observable) {
    return lastValueFrom(promiseOrObservable);
  }
  return promiseOrObservable;
};

export default completionOf;

import memoize from 'memoizee';

import { Type } from '@nestjs/common';

import wrap from '../utils/data/wrap';

import { BUILDER_CACHE_TIME } from './constants';

export type ReferenceBuilder<T> = (val: T) => string;
export type ReferenceBuilderWithRef<T> = (
  val: T,
  ref: ReferenceBuilder<unknown>,
) => string;

export interface ReferenceBuilderService<T> {
  wrapStr(str: string): string;
  wrapReference: ReferenceBuilderWithRef<T>;
  build: ReferenceBuilderWithRef<T>;
}

export abstract class ReferenceBuilderServiceBase<T>
  implements ReferenceBuilderService<T>
{
  protected constructor(private type: Type<T>, private wrapper = type.name) {}

  wrapStr(str) {
    return this.wrapper ? wrap(str, this.wrapper) : str;
  }

  wrapReference(val: T, ref: ReferenceBuilder<unknown>): string {
    return this.wrapStr(this.build(val, ref));
  }

  abstract build(val: T, ref: ReferenceBuilder<unknown>);

  static withBuild<R>(
    build: ReferenceBuilderWithRef<R>,
    type: Type<R>,
    wrapper = type.name,
  ): Type<ReferenceBuilderService<R>> {
    class ReferenceBuilderServiceImplementation
      extends ReferenceBuilderServiceBase<R>
      implements ReferenceBuilderService<R>
    {
      private buildMemoized = memoize(build, {
        length: 1,
        maxAge: BUILDER_CACHE_TIME,
      });
      constructor() {
        super(type, wrapper);
      }

      build(val, ref: ReferenceBuilder<unknown>) {
        return this.buildMemoized(val, ref);
      }
    }

    return ReferenceBuilderServiceImplementation;
  }
}

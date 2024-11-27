import {
  TransformationType,
  ClassTransformer as Base,
} from 'class-transformer';
import constants = require('class-transformer/cjs/constants/default-options.constant');
import { ClassTransformOptions } from 'class-transformer/types/interfaces';

import { Type } from '@nestjs/common';

import { TransformOperationExecutor } from './transform-operation-executor';

type Plain = Record<string, unknown>;

export class ClassTransformer extends Base implements Base {
  instanceToPlain<T>(object: T, options?: ClassTransformOptions): Plain;
  instanceToPlain<T>(object: T[], options?: ClassTransformOptions): Plain[];
  instanceToPlain<T>(
    object: T | T[],
    options?: ClassTransformOptions,
  ): Plain | Plain[] {
    const executor = new TransformOperationExecutor(
      TransformationType.CLASS_TO_PLAIN,
      {
        ...constants.defaultOptions,
        ...options,
      },
    );
    return executor.transform(
      undefined,
      object,
      undefined,
      undefined,
      undefined,
    ) as Plain | Plain[];
  }
  classToPlainFromExist<T, P extends Plain>(
    object: T,
    plainObject: P,
    options?: ClassTransformOptions,
  ): Plain;
  classToPlainFromExist<T, P extends Plain>(
    object: T[],
    plainObject: P[],
    options?: ClassTransformOptions,
  ): Plain[];
  classToPlainFromExist<T, P extends Plain>(
    object: T | T[],
    plainObject: P | P[],
    options?: ClassTransformOptions,
  ): Plain | Plain[] {
    const executor = new TransformOperationExecutor(
      TransformationType.CLASS_TO_PLAIN,
      {
        ...constants.defaultOptions,
        ...options,
      },
    );
    return executor.transform(
      plainObject,
      object,
      undefined,
      undefined,
      undefined,
    ) as Plain | Plain[];
  }
  plainToInstance<T, V extends Plain>(
    cls: Type<T>,
    plain: V,
    options?: ClassTransformOptions,
  ): T;
  plainToInstance<T, V extends Plain[]>(
    cls: Type<T>,
    plain: V,
    options?: ClassTransformOptions,
  ): T[];
  plainToInstance<T, V extends Plain | Plain[]>(
    cls: Type<T>,
    plain: V,
    options?: ClassTransformOptions,
  ): T | T[] {
    const executor = new TransformOperationExecutor(
      TransformationType.PLAIN_TO_CLASS,
      {
        ...constants.defaultOptions,
        ...options,
      },
    );
    return executor.transform(undefined, plain, cls, undefined, undefined) as
      | T
      | T[];
  }
  plainToClassFromExist<T, V extends Plain>(
    clsObject: T,
    plain: V,
    options?: ClassTransformOptions,
  ): T;
  plainToClassFromExist<T, V extends Plain[]>(
    clsObject: T,
    plain: V,
    options?: ClassTransformOptions,
  ): T[];
  plainToClassFromExist<T, V extends Plain | Plain[]>(
    clsObject: T,
    plain: V,
    options?: ClassTransformOptions,
  ): T | T[] {
    const executor = new TransformOperationExecutor(
      TransformationType.PLAIN_TO_CLASS,
      {
        ...constants.defaultOptions,
        ...options,
      },
    );
    return executor.transform(
      clsObject,
      plain,
      undefined,
      undefined,
      undefined,
    ) as T | T[];
  }
  instanceToInstance<T>(object: T, options?: ClassTransformOptions): T;
  instanceToInstance<T>(object: T[], options?: ClassTransformOptions): T[];
  instanceToInstance<T>(
    object: T | T[],
    options?: ClassTransformOptions,
  ): T | T[] {
    const executor = new TransformOperationExecutor(
      TransformationType.CLASS_TO_CLASS,
      {
        ...constants.defaultOptions,
        ...options,
      },
    );
    return executor.transform(
      undefined,
      object,
      undefined,
      undefined,
      undefined,
    ) as T | T[];
  }
  classToClassFromExist<T>(
    object: T,
    fromObject: T,
    options?: ClassTransformOptions,
  ): T;
  classToClassFromExist<T>(
    object: T,
    fromObject: T[],
    options?: ClassTransformOptions,
  ): T[];
  classToClassFromExist<T>(
    object: T,
    fromObject: T | T[],
    options?: ClassTransformOptions,
  ): T | T[] {
    const executor = new TransformOperationExecutor(
      TransformationType.CLASS_TO_CLASS,
      {
        ...constants.defaultOptions,
        ...options,
      },
    );
    return executor.transform(
      fromObject,
      object,
      undefined,
      undefined,
      undefined,
    ) as T | T[];
  }
  serialize<T extends Plain>(
    object: T,
    options?: ClassTransformOptions,
  ): string;
  serialize<T extends Plain>(
    object: T[],
    options?: ClassTransformOptions,
  ): string;
  serialize<T extends Plain>(
    object: T | T[],
    options?: ClassTransformOptions,
  ): string {
    return JSON.stringify(this.instanceToPlain(object as Plain, options));
  }

  deserialize<T>(
    cls: Type<T>,
    json: string,
    options?: ClassTransformOptions,
  ): T;
  deserialize<T extends Plain>(
    cls: Type<T>,
    json: string,
    options?: ClassTransformOptions,
  ): T | T[] {
    const jsonObject = JSON.parse(json);
    return this.plainToInstance(cls, jsonObject, options);
  }

  deserializeArray<T>(
    cls: Type<T>,
    json: string,
    options?: ClassTransformOptions,
  ): T[];
  deserializeArray<T extends Plain>(
    cls: Type<T>,
    json: string,
    options?: ClassTransformOptions,
  ): T[] {
    const jsonObject = JSON.parse(json);
    return this.plainToInstance(cls, jsonObject, options) as unknown as T[];
  }
}

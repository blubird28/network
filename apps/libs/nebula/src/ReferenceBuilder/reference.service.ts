import {
  isArray,
  isBoolean,
  isNull,
  isNumber,
  isString,
  isUndefined,
} from 'lodash';

import { Logger, Type } from '@nestjs/common';

import getErrorMessage from '../utils/data/getErrorMessage';
import wrap from '../utils/data/wrap';

import { ReferenceBuilderService } from './reference-builder.service';
import {
  WRAPPER_ARRAY,
  WRAPPER_BOOLEAN,
  WRAPPER_NULL,
  WRAPPER_NUMBER,
  WRAPPER_STRING,
  WRAPPER_UNDEFINED,
  WRAPPER_UNKNOWN,
} from './constants';
import storage from './storage';

export class ReferenceService {
  private builders = new Map<Type, ReferenceBuilderService<unknown>>();
  private logger = new Logger(ReferenceService.name);

  public reference(val: unknown, ...wrappers: string[]) {
    return wrap(this.build(val), ...wrappers);
  }

  private build(val: unknown): string {
    try {
      return (
        this.maybeBuildPrimitiveReference(val) ||
        this.maybeBuildTypeReference(val) ||
        this.buildFallbackReference(val)
      );
    } catch (err) {
      this.logger.error(
        `Error creating reference for object, falling back to Unknown reference. Error: ${getErrorMessage(
          err,
        )}`,
      );
      return this.nonUnique(WRAPPER_UNKNOWN);
    }
  }

  private maybeBuildTypeReference<T>(val: T): string | undefined {
    const builder = this.getBuilderFromVal(val);
    if (builder) {
      return builder.wrapReference(val, this.build.bind(this));
    }
  }

  private buildFallbackReference(val: unknown): string {
    if (val['id'] && isString(val['id'])) {
      this.logger.warn(
        'Using fallback id reference for Unknown reference object',
      );
      return wrap(`id: "${val['id']}"`, WRAPPER_UNKNOWN);
    }

    return this.nonUnique(WRAPPER_UNKNOWN);
  }

  private maybeBuildPrimitiveReference(val: unknown): string | undefined {
    if (isNull(val)) {
      return this.nonUnique(WRAPPER_NULL);
    }
    if (isUndefined(val)) {
      return this.nonUnique(WRAPPER_UNDEFINED);
    }
    if (isBoolean(val)) {
      return wrap(val ? 'true' : 'false', WRAPPER_BOOLEAN);
    }
    if (isString(val)) {
      return wrap(val, WRAPPER_STRING);
    }
    if (isNumber(val)) {
      return wrap(String(val), WRAPPER_NUMBER);
    }
    if (isArray(val)) {
      return wrap(val.map((v) => this.reference(v)).join(', '), WRAPPER_ARRAY);
    }
  }

  private nonUnique(nonUniqueType: string): string {
    this.logger.warn(
      `Reference builder unable to build a unique reference to this object (${nonUniqueType})`,
    );
    return wrap('', nonUniqueType);
  }

  private getBuilderFromType<T>(
    type: Type<T>,
  ): ReferenceBuilderService<T> | undefined {
    if (!this.builders.has(type)) {
      const BuilderConstructor = storage.get(type);
      if (BuilderConstructor) {
        this.builders.set(type, new BuilderConstructor());
      }
    }
    return this.builders.get(type);
  }

  private getBuilderFromVal<T>(val: T): ReferenceBuilderService<T> | undefined {
    const type = this.getTypeFromVal(val);
    if (type) {
      return this.getBuilderFromType(type);
    }
  }

  private getTypeFromVal<T>(val: T): Type<T> | undefined {
    if (val && val.constructor) {
      return val.constructor as Type<T>;
    }
  }
}

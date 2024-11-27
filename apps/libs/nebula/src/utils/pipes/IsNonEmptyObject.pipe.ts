import { isObject, isNull, isString, isBoolean } from 'lodash';

import { Injectable, PipeTransform } from '@nestjs/common';

import Errors, { ErrorCode } from '@libs/nebula/Error';

@Injectable()
export class IsNonEmptyObjectPipe implements PipeTransform {
  constructor(private readonly error: ErrorCode = ErrorCode.ValidationFailed) {}

  transform<T = unknown>(value: T): T {
    if (
      !isObject(value) ||
      !Object.values(value).some(this.isNonEmptyValue.bind(this))
    ) {
      throw new Errors[this.error]();
    }
    return value;
  }

  private isNonEmptyValue(value: unknown): boolean {
    return (
      !isNull(value) && (isString(value) || isObject(value) || isBoolean(value))
    );
  }
}

import {
  BaseException,
  ErrorData,
  ExceptionType,
  ValidatorContext,
} from './BaseException';
import { DEFAULT_HTTP_STATUS, ErrorCode } from './constants';

export const ExceptionTypeFactory = (
  code: ErrorCode,
  httpStatus: number = DEFAULT_HTTP_STATUS,
): ExceptionType => {
  class ExceptionType extends BaseException {
    static context: ValidatorContext = {
      code,
      httpStatus,
    };

    constructor(data?: ErrorData) {
      super(code, httpStatus, data);
    }
  }

  return ExceptionType;
};

import { BaseException } from '../BaseException';
import { ErrorCode } from '../constants';

const dataFromErrors = (exceptions: BaseException[]) => {
  const errors = exceptions.map((e) => e.toObject());
  return {
    errors,
    messages: errors.reduce(
      (acc, curr) => (acc ? `${acc}; ${curr.message}` : curr.message),
      '',
    ),
  };
};

export class MultipleErrors extends BaseException {
  constructor(errors: BaseException[], httpStatus?: number) {
    super(ErrorCode.MultipleErrors, httpStatus, dataFromErrors(errors));
  }
}

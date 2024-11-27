import { createErrorsProxy } from './Errors.proxy';

const Errors = createErrorsProxy();
export default Errors;

export {
  ErrorCode,
  ErrorKey,
  DEFAULT_ERROR_CODE,
  DEFAULT_HTTP_STATUS,
} from './constants';

export { BaseValidationPipe } from '../Serialization/BaseValidationPipe';
export { BaseExceptionFilter } from './BaseException.filter';
export {
  SharedError,
  ErrorData,
  ValidatorContext,
  ExceptionType,
  BaseException,
} from './BaseException';

import { MultipleErrors } from './special/MultipleErrors';
import { ExceptionTypeFactory } from './ExceptionType.factory';
import { ExceptionType } from './BaseException';
import { DEFAULT_ERROR_CODE, ErrorCode, ErrorKey } from './constants';
import { ErrorParams } from './error-params';

type FactoryExceptionTypesByEnumValue = {
  [key in ErrorCode]: ExceptionType;
};
type FactoryExceptionTypesByEnumKey = {
  [key in ErrorKey]: ExceptionType;
};

type SpecialExceptionTypes = {
  [ErrorCode.MultipleErrors]: typeof MultipleErrors;
  MultipleErrors: typeof MultipleErrors;
};

type FactoryExceptionTypes = FactoryExceptionTypesByEnumValue &
  FactoryExceptionTypesByEnumKey;
type ExceptionTypes = FactoryExceptionTypes & SpecialExceptionTypes;
export const KEY_TO_FACTORY_PARAMS = ErrorParams;

const addFactoryErrorTypeByKeyAndCode = (
  errors: FactoryExceptionTypes,
  key: ErrorKey,
  status: number,
) => {
  const code = ErrorCode[key];
  const Type = ExceptionTypeFactory(code, status);
  Object.defineProperty(Type, 'name', {
    value: `${key}Error`,
  });
  errors[key] = Type;
  errors[code] = Type;
  return errors;
};

export const createErrorsProxy = () => {
  const specialExceptionTypes: SpecialExceptionTypes = {
    MultipleErrors: MultipleErrors,
    [ErrorCode.MultipleErrors]: MultipleErrors,
  };

  const factoryExceptionTypes = [
    ...KEY_TO_FACTORY_PARAMS.entries(),
  ].reduce<FactoryExceptionTypes>(
    (acc, [key, status]) => addFactoryErrorTypeByKeyAndCode(acc, key, status),
    {} as FactoryExceptionTypes,
  );

  return new Proxy<ExceptionTypes>(factoryExceptionTypes as ExceptionTypes, {
    get: (base, prop) => {
      if (base[prop]) {
        return base[prop];
      }
      if (specialExceptionTypes[prop]) {
        return specialExceptionTypes[prop];
      }
      return base[DEFAULT_ERROR_CODE];
    },
  });
};

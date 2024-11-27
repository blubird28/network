import { identity, isArray, isBoolean, isString } from 'lodash';
import { IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

import Prop, {
  Converter,
  getValidationOptions,
  OnlyDeserializeIf,
  PropOptions,
} from './Prop.decorator';

export interface BooleanPropOptions extends PropOptions {
  typeCheck: boolean;
  convert: boolean | unknown[];
}
const DEFAULTS: BooleanPropOptions = {
  optional: false,
  expose: true,
  typeCheck: true,
  convert: false,
};
type BooleanConverter = Converter<boolean>;
const TRUE_VALUES = ['1', 'y', 'yes', 'true', 'on', true, 1];

export const createBooleanConverter =
  (trueValues: unknown[]): BooleanConverter =>
  (value: unknown) =>
    trueValues.includes(isString(value) ? value.toLowerCase() : value);

const booleanConverter = createBooleanConverter(TRUE_VALUES);

const getConverter = (convert: boolean | unknown[]): BooleanConverter => {
  if (convert === true) {
    return booleanConverter;
  }
  if (isArray(convert)) {
    return createBooleanConverter(convert);
  }

  return identity;
};

export const OnlyDeserializeBoolean = (converter: BooleanConverter) =>
  OnlyDeserializeIf(isBoolean, converter);
const BooleanProp = (
  options: Partial<BooleanPropOptions> = {},
  ...extraDecorators: (PropertyDecorator | false)[]
): PropertyDecorator => {
  const { convert, error, typeCheck } = {
    ...DEFAULTS,
    ...options,
  };
  const validationOptions = getValidationOptions(error);
  return Prop(
    options,
    Type(() => Boolean),
    (typeCheck || convert) && OnlyDeserializeBoolean(getConverter(convert)),
    typeCheck && IsBoolean(validationOptions),
    ...extraDecorators,
  );
};

export default BooleanProp;

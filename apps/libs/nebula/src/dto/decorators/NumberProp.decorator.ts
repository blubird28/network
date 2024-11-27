import { identity, isNumber, isString } from 'lodash';
import { IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

import Prop, {
  Converter,
  getValidationOptions,
  OnlyDeserializeIf,
  PropOptions,
} from './Prop.decorator';

export interface NumberPropOptions extends PropOptions {
  typeCheck: boolean;
  converter: false | Converter<number>;
  allowNaN: boolean;
  allowInfinity: boolean;
}
const DEFAULTS: NumberPropOptions = {
  optional: false,
  expose: true,
  typeCheck: true,
  converter: false,
  allowNaN: false,
  allowInfinity: false,
};

export const intConverter: Converter<number> = (val) =>
  isString(val) ? parseInt(val, 10) : null;
export const floatConverter: Converter<number> = (val) =>
  isString(val) ? parseFloat(val) : null;

export const OnlyDeserializeNumber = (converter: Converter<number>) =>
  OnlyDeserializeIf(isNumber, converter);
const NumberProp = (
  options: Partial<NumberPropOptions> = {},
  ...extraDecorators: (PropertyDecorator | false)[]
): PropertyDecorator => {
  const { allowNaN, allowInfinity, converter, error, typeCheck } = {
    ...DEFAULTS,
    ...options,
  };
  const validationOptions = getValidationOptions(error);
  return Prop(
    options,
    Type(() => Number),
    typeCheck && OnlyDeserializeNumber(converter || identity),
    typeCheck && IsNumber({ allowNaN, allowInfinity }, validationOptions),
    ...extraDecorators,
  );
};

export default NumberProp;

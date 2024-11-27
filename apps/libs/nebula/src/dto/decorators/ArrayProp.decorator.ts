import { ArrayNotEmpty, IsArray, IsString } from 'class-validator';
import { Type } from 'class-transformer';

import Prop, { getValidationOptions, PropOptions } from './Prop.decorator';

export interface ArrayPropOptions extends PropOptions {
  typeCheck: boolean;
  allowEmpty: boolean;
}

const DEFAULTS: ArrayPropOptions = {
  typeCheck: true,
  expose: true,
  allowEmpty: true,
  optional: false,
};
const ArrayProp = (
  options: Partial<ArrayPropOptions> = {},
  ...extraDecorators: (PropertyDecorator | false)[]
): PropertyDecorator => {
  const { allowEmpty, error, typeCheck } = {
    ...DEFAULTS,
    ...options,
  };
  const validationOptions = getValidationOptions(error);
  return Prop(
    options,
    typeCheck && IsArray(validationOptions),
    !allowEmpty && ArrayNotEmpty(validationOptions),
    ...extraDecorators,
  );
};

export const StringArrayProp = (
  options: Partial<ArrayPropOptions> = {},
  ...extraDecorators: (PropertyDecorator | false)[]
) => {
  const { error, typeCheck } = {
    ...DEFAULTS,
    ...options,
  };
  return ArrayProp(
    options,
    Type(() => String),
    typeCheck && IsString({ ...getValidationOptions(error), each: true }),
    ...extraDecorators,
  );
};
export default ArrayProp;

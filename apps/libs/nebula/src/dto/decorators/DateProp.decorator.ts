import { isDate, isString } from 'lodash';
import { IsDate } from 'class-validator';
import { Type } from 'class-transformer';

import { FIRST_JAN_2020 } from '../../testing/data/constants';

import Prop, {
  Converter,
  getValidationOptions,
  OnlyDeserializeIf,
  PropOptions,
} from './Prop.decorator';

export interface DatePropOptions extends PropOptions {
  typeCheck: boolean;
  converter: Converter<Date>;
}

const ISO_8601_REGEX =
  /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/;

const iso8601Converter: Converter<Date> = (val) => {
  if (isDate(val)) {
    return val;
  }
  if (isString(val) && ISO_8601_REGEX.test(val)) {
    return new Date(val);
  }
  return null;
};

const DEFAULTS: DatePropOptions = {
  optional: false,
  expose: true,
  typeCheck: true,
  fake: FIRST_JAN_2020,
  converter: iso8601Converter,
};

export const OnlyDeserializeDate = (converter: Converter<Date>) =>
  OnlyDeserializeIf(isDate, converter);
const DateProp = (
  options: Partial<DatePropOptions> = {},
  ...extraDecorators: (PropertyDecorator | false)[]
): PropertyDecorator => {
  const resolvedOptions = {
    ...DEFAULTS,
    ...options,
  };
  const { converter, error, typeCheck } = resolvedOptions;
  const validationOptions = getValidationOptions(error);
  return Prop(
    resolvedOptions,
    Type(() => Date),
    typeCheck && OnlyDeserializeDate(converter),
    typeCheck && IsDate(validationOptions),
    ...extraDecorators,
  );
};

export default DateProp;

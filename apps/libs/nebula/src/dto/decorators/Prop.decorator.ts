import { Expose, Transform } from 'class-transformer';
import { identity, isString, isUndefined } from 'lodash';
import { IsOptional, ValidationOptions } from 'class-validator';

import { applyDecorators } from '@nestjs/common';

import { ExceptionType } from '../../Error';
import { Fake } from '../../testing/data/fakers';
import { MaybeOverrider } from '../../testing/data/fakers/types';

export interface PropOptions<T = unknown> {
  optional: boolean;
  expose: boolean | string;
  fake?: MaybeOverrider<T>;
  error?: ExceptionType;
}
const DEFAULTS: PropOptions = {
  expose: true,
  optional: false,
};
export type Predicate = (val: unknown) => boolean;
export type Converter<T = unknown> = (val: unknown) => T;
export const OnlyDeserializeIf = <T = unknown>(
  predicate: Predicate,
  convert: Converter<T> = identity,
) =>
  Transform(
    ({ obj, key }) => {
      const val = convert(obj[key]);
      return isUndefined(val) || predicate(val) ? val : null;
    },
    {
      toClassOnly: true,
    },
  );
export const getValidationOptions = (
  error?: ExceptionType,
): ValidationOptions => (error?.context ? { context: error.context } : {});
const Prop = (
  options: Partial<PropOptions> = {},
  ...extraDecorators: (PropertyDecorator | false)[]
): PropertyDecorator => {
  const { fake, expose, error, optional } = { ...DEFAULTS, ...options };
  const validationOptions = getValidationOptions(error);
  const decorators = [
    expose !== false && Expose(isString(expose) ? { name: expose } : undefined),
    optional && IsOptional(validationOptions),
    !isUndefined(fake) && Fake(fake),
    ...extraDecorators,
  ].filter(Boolean) as PropertyDecorator[];
  return applyDecorators(...decorators);
};

export default Prop;

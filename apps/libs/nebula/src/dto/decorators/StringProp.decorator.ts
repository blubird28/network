import { isString, isUndefined } from 'lodash';
import {
  IsMongoId,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';

import { IsV4UUID } from '../../utils/decorators/isV4UUID.decorator';
import { IsAnyUUID } from '../../utils/decorators/isAnyUUID.decorator';
import {
  FAKE_OBJECT_ID,
  FAKE_UUID,
  FAKE_UUID_V1,
} from '../../testing/data/constants';

import Prop, {
  getValidationOptions,
  OnlyDeserializeIf,
  PropOptions,
} from './Prop.decorator';

export interface StringPropOptions extends PropOptions {
  typeCheck: boolean;
  allowEmpty: boolean;
  minLength?: number;
  maxLength?: number;
}
const DEFAULTS: StringPropOptions = {
  typeCheck: true,
  expose: true,
  allowEmpty: true,
  optional: false,
};
export const OnlyDeserializeStrings = () => OnlyDeserializeIf(isString);
const StringProp = (
  options: Partial<StringPropOptions> = {},
  ...extraDecorators: (PropertyDecorator | false)[]
): PropertyDecorator => {
  const { allowEmpty, error, maxLength, minLength, typeCheck } = {
    ...DEFAULTS,
    ...options,
  };
  const validationOptions = getValidationOptions(error);
  return Prop(
    options,
    Type(() => String),
    typeCheck && OnlyDeserializeStrings(),
    typeCheck && IsString(validationOptions),
    !isUndefined(minLength) && MinLength(minLength, validationOptions),
    !isUndefined(maxLength) && MaxLength(maxLength, validationOptions),
    !allowEmpty && IsNotEmpty(validationOptions),
    ...extraDecorators,
  );
};

const ID_DEFAULTS: StringPropOptions = {
  ...DEFAULTS,
  allowEmpty: false,
};
export const UUIDv4Prop = (
  options: Partial<StringPropOptions> = {},
  ...extraDecorators: (PropertyDecorator | false)[]
): PropertyDecorator => {
  const resolvedOptions = {
    ...ID_DEFAULTS,
    fake: FAKE_UUID,
    ...options,
  };
  const validationOptions = getValidationOptions(resolvedOptions.error);
  return StringProp(
    resolvedOptions,
    IsV4UUID(validationOptions),
    ...extraDecorators,
  );
};

export const UUIDProp = (
  options: Partial<StringPropOptions> = {},
  ...extraDecorators: (PropertyDecorator | false)[]
): PropertyDecorator => {
  const resolvedOptions = {
    ...ID_DEFAULTS,
    fake: FAKE_UUID_V1,
    ...options,
  };
  const validationOptions = getValidationOptions(resolvedOptions.error);
  return StringProp(
    resolvedOptions,
    IsAnyUUID(validationOptions),
    ...extraDecorators,
  );
};

export const MongoIDProp = (
  options: Partial<StringPropOptions> = {},
  ...extraDecorators: (PropertyDecorator | false)[]
): PropertyDecorator => {
  const resolvedOptions = {
    ...ID_DEFAULTS,
    fake: FAKE_OBJECT_ID,
    ...options,
  };
  const validationOptions = getValidationOptions(resolvedOptions.error);
  return StringProp(
    resolvedOptions,
    IsMongoId(validationOptions),
    ...extraDecorators,
  );
};

export default StringProp;

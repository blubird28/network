import {
  isArray,
  isBoolean,
  isDate,
  isFunction,
  isNull,
  isNumber,
  isPlainObject,
  isString,
  isUndefined,
} from 'lodash';
import { TransformationType } from 'class-transformer';

import { OneOrMore } from '@libs/nebula/utils/data/oneOrMore';
import { BoundTransform } from '@libs/nebula/class-transformer/transform-operation-executor';

import Errors from '../Error';

export type BasicTypes = string | number | boolean | Date | null | undefined;
export type SerializedValue =
  | OneOrMore<SerializedObject>
  | OneOrMore<BasicTypes>;
export interface SerializedObject {
  [key: string]: SerializedData;
}
export type SerializedData = OneOrMore<SerializedValue>;

export const SERIALIZE = Symbol.for('constellation:serialize');

export type Serializer<T extends SerializedData = SerializedData> = (
  source: unknown,
  value: unknown,
  type: TransformationType,
  transform: BoundTransform,
) => T;

export const isBasicType = (obj: unknown): obj is BasicTypes =>
  [isUndefined, isNull, isString, isBoolean, isDate, isNumber].some((t) =>
    t(obj),
  );

export const isSerializedValue = (val: unknown): val is SerializedValue =>
  isBasicType(val) ||
  isSerializedObject(val) ||
  (isArray(val) && val.every(isSerializedValue));

export const isSerializedObject = (obj: unknown): obj is SerializedObject =>
  isPlainObject(obj) && Object.values(obj).every(isSerializedValue);

export const isSerializedData = (val: unknown): val is SerializedData =>
  isArray(val) ? val.every(isSerializedValue) : isSerializedValue(val);

export interface Serializes<T extends SerializedData = SerializedData>
  extends Function {
  [SERIALIZE]: Serializer<T>;
}

export const SerializesWith =
  <T extends SerializedData>(serializer: Serializer<T>): ClassDecorator =>
  (target) => {
    target[SERIALIZE] = serializer;
    return target;
  };

export const hasSerializer = <T extends SerializedData = SerializedData>(
  type: unknown,
): type is Serializes<T> => isFunction(type) && isFunction(type?.[SERIALIZE]);

export class Serialized<T extends SerializedData = SerializedData> {
  private readonly data: T;

  constructor(data: T) {
    if (!isSerializedData(data)) {
      throw new Errors.UnserializedData();
    }

    this.data = data;
  }

  getData(): T {
    return this.data;
  }

  toJSON() {
    return this.getData();
  }
}

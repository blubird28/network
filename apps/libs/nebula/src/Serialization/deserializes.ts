import { TransformationType } from 'class-transformer';
import { TransformOperationExecutor } from 'class-transformer/types/TransformOperationExecutor';
import { isFunction } from 'lodash';

export const DESERIALIZE = Symbol.for('constellation:deserialize');

export type Deserializer<T> = (
  source: unknown,
  value: unknown,
  type: TransformationType,
  transform: TransformOperationExecutor['transform'],
) => T;

export interface Deserializes<T> extends Function {
  [DESERIALIZE]: Deserializer<T>;
}

export const DeserializesWith =
  <T>(deserializer: Deserializer<T>): ClassDecorator =>
  (target) => {
    target[DESERIALIZE] = deserializer;
    return target;
  };

export const hasDeserializer = <T = unknown>(
  type: unknown,
): type is Deserializes<T> =>
  isFunction(type) && isFunction(type?.[DESERIALIZE]);

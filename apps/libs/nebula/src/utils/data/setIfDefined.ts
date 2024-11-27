/* eslint-disable @typescript-eslint/ban-types */
import { isArray, isUndefined } from 'lodash';

const setIfDefinedSingle = <T extends Object, K extends keyof T>(
  target: T,
  key: K,
  val: T[K] | undefined,
): T => {
  if (!isUndefined(val)) {
    target[key] = val;
  }

  return target;
};

const setIfDefinedMulti = <T extends Object, K extends keyof T>(
  target: T,
  keys: K[],
  vals: Partial<Pick<T, K>>,
) => {
  keys.forEach((key) => setIfDefinedSingle(target, key, vals[key]));

  return target;
};

export interface SetIfDefinedOverload {
  <T extends Object, K extends keyof T>(
    target: T,
    key: K,
    val: T[K] | undefined,
  ): T;
  <T extends Object, K extends keyof T>(
    target: T,
    keys: K[],
    vals: Partial<T>,
  ): T;
}

export const setIfDefined: SetIfDefinedOverload = (
  target,
  keyOrKeys,
  valOrVals,
) =>
  isArray(keyOrKeys)
    ? setIfDefinedMulti(target, keyOrKeys, valOrVals)
    : setIfDefinedSingle(target, keyOrKeys, valOrVals);

export default setIfDefined;

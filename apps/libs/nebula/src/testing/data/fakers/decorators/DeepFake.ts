import { FakerOptionsProvided, FakerTarget } from '../types';
import { faker } from '..';

import { createFakerDecorator } from './createFakerDecorator';

export type InstanceOrPartial<T extends FakerTarget> =
  | InstanceType<T>
  | Partial<InstanceType<T>>;

export const maybeDeepFake = <T extends FakerTarget>(
  target: T,
  baseOverrides?: InstanceOrPartial<T>,
  callOverrides?: InstanceOrPartial<T>,
  options: FakerOptionsProvided = {},
): InstanceType<T> => {
  if (callOverrides instanceof target) {
    return callOverrides as InstanceType<T>;
  }

  if (baseOverrides instanceof target) {
    return baseOverrides as InstanceType<T>;
  }

  const overrides = {
    ...(baseOverrides || {}),
    ...(callOverrides || {}),
  } as Partial<InstanceType<T>>;

  return faker(target, overrides, options);
};

export const DeepFake = <T extends FakerTarget>(
  target: () => T,
  overrides: Partial<InstanceType<T>> = {},
  options: FakerOptionsProvided = {},
) =>
  createFakerDecorator<InstanceType<T>>((callOverrides) =>
    maybeDeepFake(target(), overrides, callOverrides, options),
  );

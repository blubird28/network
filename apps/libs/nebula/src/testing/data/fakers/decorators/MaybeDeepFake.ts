import { isNull } from 'lodash';

import { FakerOptionsProvided, FakerTarget } from '../types';

import { InstanceOrPartial, maybeDeepFake } from './DeepFake';
import { createFakerDecorator } from './createFakerDecorator';

export const MaybeDeepFake = <T extends FakerTarget>(
  target: () => T,
  defaultNull = true,
  overrides: Partial<InstanceType<T>> = {},
  options: FakerOptionsProvided = {},
) =>
  createFakerDecorator<InstanceOrPartial<any>>((callOverrides) =>
    isNull(callOverrides) || (defaultNull && !callOverrides)
      ? undefined
      : maybeDeepFake(target(), overrides, callOverrides, options),
  );

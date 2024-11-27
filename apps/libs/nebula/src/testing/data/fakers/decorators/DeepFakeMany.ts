import { FakerOptionsProvided, FakerTarget } from '../types';
import zeroOrMore, { ZeroOrMore } from '../../../../utils/data/zeroOrMore';

import { maybeDeepFake } from './DeepFake';
import { createFakerDecorator } from './createFakerDecorator';

export const DeepFakeMany = <T extends FakerTarget>(
  target: () => T,
  overrides: ZeroOrMore<Partial<InstanceType<T>>> = [],
  options: FakerOptionsProvided = {},
) =>
  createFakerDecorator<InstanceType<T>[]>((callOverrides) => {
    const useCallOverrides = !!callOverrides;
    const baseOverrides = zeroOrMore(overrides);
    const base =
      !useCallOverrides ||
      baseOverrides.length !== 1 ||
      baseOverrides[0] instanceof target()
        ? {}
        : baseOverrides[0];
    const useOverrides = useCallOverrides
      ? zeroOrMore(callOverrides)
      : baseOverrides;
    return useOverrides.map((override) =>
      maybeDeepFake(target(), base, override, options),
    );
  });
